import { ProseMirror } from "@nytimes/react-prosemirror";
import React, { useEffect, useState } from "react";
import { schema } from "prosemirror-schema-basic";
import { EditorState, Plugin } from "prosemirror-state";
import { exampleSetup } from "prosemirror-example-setup";
import { Schema, DOMParser, DOMSerializer } from "prosemirror-model";
import { addListNodes } from "prosemirror-schema-list";
import { ContentEditorProps } from "./ContentEditor.d";
import { MarkSpec } from "prosemirror-model";

// menu items
import { MenuItem } from "prosemirror-menu";
import { buildMenuItems } from "prosemirror-example-setup";

// commands
const shoutingMark = {
  toDOM() {
    return ["shouting", 0];
  },
  parseDOM: { tag: "shouting" },
} as unknown as MarkSpec;

// plugin example
const onUpdatePlugin = new Plugin({
  view() {
    return {
      update(updateEditorView) {
        const $anchor = updateEditorView.state.selection.$anchor;
        console.log($anchor);
      },
    };
  },
});
// > deal with menu
const annotationSchema = new Schema({
  nodes: {},
  marks: shoutingMark,
});

const menu = buildMenuItems(annotationSchema);
//> populate marks
["ref", "author", "person", "date"].forEach((name) =>
  menu.inlineMenu.push([
    new MenuItem({
      title: "Insert " + name,
      label: name.charAt(0).toUpperCase() + name.slice(1),
      enable(state) {
        return true;
      },
      run: () => {
        alert("this");
      },
    }),
  ])
);

export const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks,
});
/**
console.log(">>>schema>>>>");
console.log(mySchema);
*/
export const ContentEditor: React.FC<ContentEditorProps> = (
  props: ContentEditorProps
) => {
  const [mount, setMount] = useState<HTMLElement | null>(null);

  const serializer = DOMSerializer.fromSchema(mySchema);

  // prose mirror state
  const state = EditorState.create({
    // doc: schema.topNodeType.create(null),
    schema: mySchema,
    plugins: [
      ...exampleSetup({
        schema: mySchema,
        menuContent: menu.fullMenu as MenuItem[][],
      }),
      onUpdatePlugin,
    ],
  });
  const [editorState, setEditorState] = useState(state);

  useEffect(() => {
    props.onUpdate(editorState);
  }, [editorState, serializer]);

  const handleTransaction = (tr: any) => {
    setEditorState((s) => s.apply(tr));
  };

  return (
    <ProseMirror
      mount={mount}
      state={editorState}
      dispatchTransaction={handleTransaction}
    >
      <div
        ref={setMount}
        style={{
          flexGrow: 1,
          background: "white",
          height: "150px",
          border: "1px solid red",
          textAlign: "left",
        }}
      ></div>
    </ProseMirror>
  );
};
