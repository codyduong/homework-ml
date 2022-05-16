// Parser for generic FRQs from Achieve

import type { FileData } from '.';
import { Data, Results } from './.types';

function _findAnswer(root: Element | null) {
  const rootBlock = root?.getElementsByClassName('mq-root-block')[0];

  const blocks = rootBlock?.children ?? [];

  let stringBuffer = '';

  for (const block of blocks) {
    const className = block.className.split(' ');

    if (className[0] === 'mq-fraction') {
      const [numerator, denominator] = block.children;

      stringBuffer += `(${numerator.textContent})/(${denominator.textContent})`;
      continue;
    }

    stringBuffer += block.textContent;
  }

  return stringBuffer;
}

function FRQParser(document: Document, fileData: FileData): Results {
  const wrapperArticle = document.getElementsByClassName(
    'parent-module-container'
  )[0];
  if (!wrapperArticle) {
    throw new Error(
      'Failed to find <article> with className = `parent-module-container`'
    );
  }

  const articles = wrapperArticle.querySelectorAll('article');
  if (articles.length < 0) {
    throw new Error(
      'Failed to find <article>s with classNames = `module-container`'
    );
  }

  const data: Data = [];

  for (const article of articles) {
    /**
     * Cleanup any unused/confusing data unnecessary to parsing
     */
    const spans = article.querySelectorAll('span');
    for (const span of spans) {
      // Remove redundant data
      if (
        span.className === 'MJX_Assistive_MathML'
        //span.className === 'MJX_Assistive_MathML MJX_Assistive_MathML_Block' ||
        //span.className === 'MathJax'
      ) {
        span.remove();
      }
    }

    const removeDivs = article.querySelectorAll('div');
    for (const div of removeDivs) {
      if (
        ['numeric-entry-sci-not-warn', 'numeric-entry-toolmenu'].includes(
          div.className
        )
      ) {
        div.remove();
      }
    }

    /**
     * Find all remaining text
     */
    const paragraphs = article.querySelectorAll('p');

    // Handles MC
    const fieldset = article.querySelector('fieldset');
    const wrapperDiv = fieldset?.getElementsByClassName(
      'mc-choice-item indent'
    )[0];
    if (
      fieldset &&
      wrapperDiv &&
      ('mc-choice-item indent' == wrapperDiv?.className ?? '')
    ) {
      const legend = fieldset
        .querySelector('legend')
        ?.querySelector('span')?.textContent;

      const prompt: Data[number] = {
        type: 'prompt_mc',
        content: legend?.trim() ?? '',
        answers: [],
        non_answers: [],
      };

      const mcDivs = wrapperDiv.children;

      for (const div of mcDivs) {
        const input = div.querySelector('input');
        const label = div.querySelector('label');
        const span = div?.querySelector('span');
        const image = div?.querySelector('img');
        const answer = label?.textContent?.trim();

        // find answer via another method:
        if (!answer) {
          _findAnswer(span);
        }

        if (input?.checked) {
          answer && prompt.answers.push(answer);
          image &&
            prompt.answers.push({
              image_url: image.src,
              alt: image.alt,
              caption: answer || undefined,
            });
        } else {
          answer && prompt.non_answers.push(answer);
          image &&
            prompt.non_answers.push({
              image_url: image.src,
              alt: image.alt,
              caption: answer || undefined,
            });
        }
      }
      data.push(prompt);

      continue;
    }

    // Handles FRQ
    let textContents: string[] = [];

    // This is a container for the prompt
    if (paragraphs.length > 0) {
      for (const paragraph of paragraphs) {
        const image = paragraph.querySelector('img');

        // This is blocked scoped mathJax which goes column first, which means textContent is rendered incorrectly...
        const mathJax = article
          .getElementsByClassName('MathJax_Display')
          .item(0);

        if (image) {
          //Empty current buffer
          data.push({
            type: 'info',
            content: textContents.join(' ')?.replace(/(\s\s+)/g, ' '),
          });
          textContents = [];
          data.push({
            type: 'info',
            content: {
              image_url: image.src,
              alt: image.alt,
            },
          });
        } else {
          if (paragraph.textContent) {
            textContents.push(paragraph.textContent);
          } else {
            const toAdd = (() => {
              // We'll use assistive text since it's easier to parse here
              const mathML_mtable = mathJax
                ?.getElementsByClassName(
                  'MJX_Assistive_MathML MJX_Assistive_MathML_Block'
                )
                .item(0)
                ?.querySelector('mtable');
              const returnArray: string[] = [];
              mathML_mtable?.childNodes.forEach((c) => {
                c.textContent && returnArray.push(c.textContent);
              });
              mathML_mtable?.remove();
              return returnArray;
            })();

            textContents.push(...toAdd);
          }
        }
      }
      textContents.length > 0 &&
        data.push({
          type: 'info',
          content: textContents.join(' ')?.replace(/(\s\s+)/g, ' '),
        });
    } else {
      const delimiter = article.textContent?.includes('$$') ? '$$' : 'tools';
      const [prompt, answer] = article.textContent?.split(delimiter) ?? [];

      // Sometimes not in textContent
      const answerFinal = !answer
        ? article.getElementsByTagName('input').item(0)?.value
        : _findAnswer(article);

      // Unable to find answer, move to another parser
      if (!answerFinal) {
        throw new Error('Failed to find answer');
      }

      data.push({
        type: 'prompt_frq',
        content: prompt,
        answer: answerFinal,
      });
    }
  }

  return {
    name: fileData.filename,
    data: data,
  };
}

export default FRQParser;
