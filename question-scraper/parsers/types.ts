export type Image = {
  image_url: string;
  alt: string;
  caption?: string | undefined;
};

export type ContentType = string | Image;

export type Data = Array<
  | {
      type: 'info';
      content: ContentType;
    }
  | {
      type: 'prompt_frq';
      content: ContentType;
      answer: ContentType;
    }
  | {
      type: 'prompt_mc';
      content: string;
      answers: ContentType[];
      non_answers: ContentType[];
    }
>;

export type Results =
  | {
      name: string;
      data: Data;
    }
  | {
      name: string;
      errors: unknown;
    };
