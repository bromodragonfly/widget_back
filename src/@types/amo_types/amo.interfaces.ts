export interface amoError {
  response: {
    data: {
      ['validation-errors']: Array<unknown>;
      title: string;
      status: number;
    };
  };
}
