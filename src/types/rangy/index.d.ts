/// <reference types="rangy" />
interface RangyStatic {
  createHighlighter(): Highlighter;
  serializeSelection(
    selection: Selection,
    omitChecksum: boolean,
    rootNode: DOMElement
  ): string;
  createClassApplier(
    tClass: string,
    options: Record<string, any>
  ): RangyClassApplier;
}

interface Highlighter {
  addClassApplier(classApplier: RangyClassApplier): void;
  highlightSelection(className: string, options: Record<string, any>);
}
