declare module 'word-extractor' {
  interface Document {
    getBody(): string;
    getFootnotes(): string;
    getHeaders(): string;
    getAnnotations(): string;
  }

  class WordExtractor {
    extract(filePath: string): Promise<Document>;
  }

  export = WordExtractor;
}
