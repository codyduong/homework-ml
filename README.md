# homework-ml
`This is currently a stub and work-in-progress README. TODO`

**Problem Statement:** I don't like doing online homework.

**Answer Statement:** Spend way more time writing a machine learning algo to do my homework for me.

This is a monorepo* containing other repos managed with workspaces, with some subrepos actually being
git submodules. To update the submodules as needed, use `git submodule update --recursive`

### File Directory
* <b>question-scraper</b><br>
  Scrapes .mhtml files of webpages to reformat in a .JSON format to utilize in training some ML algo.
  In main directory run with `yarn scrape`, otherwise in subdirectory run with `yarn start`.
  * <b>input</b> Submodule linked to [`https://github.com/codyduong/homework-ml-input`](https://github.com/codyduong/homework-ml-input)
  * <b>output</b> Generated directory
  * <b>parsers</b>
    Contains various parsers for parsing through various online assessment formats. [See supported formats](https://github.com/codyduong/homework-ml/tree/main/question-scraper/parsers)
  * 
* <b>question-generator</b><br>
  Generates questions based on the scraped question format for more training data.
  In main directory run with `yarn generate`, otherwise in subdirectory run with `yarn start`.
  * <b>generators</b>
    Writes various FRQ/MQ questions
* ml
  * STUB
