import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { MdAdd, MdOutlineVisibility } from "react-icons/md";
import { newAnnotation, loadAnnotations } from "../features/annotationSlice";
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";

import { ContentSearchField } from "./ContentSearchField";

export const LayersEditor = () => {
  // data
  const selection = useAppSelector((state) => state.global.selection);
  const message = useAppSelector((state) => state.global.selectedMessage);

  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);

  const displayMode = useAppSelector(
    (state) => state.global.displayLayerEditor
  );

  const selectedMessageAnnotations: Annotation[] = useAppSelector(
    (state) => state.annotations.annotations
  );

  // search Handler
  const searchHandler = () => {};

  // use hook
  useEffect(() => {
    if (highlighter) return;
    rangy.addInitListener((d: RangyStatic) => {
      const highlighter: Highlighter = rangy.createHighlighter();
      highlighter.addClassApplier(
        rangy.createClassApplier("highlight", {
          ignoreWhiteSpace: true,
          tagNames: ["span", "a"],
        })
      );
      /*  const result = rangy.serializeSelection(
        window.getSelection() as Selection,
        true,
        document.getRootNode()
      );*/
      //console.log(result);
      setHighlighter(highlighter);
    });
  }, []);

  // logic
  const dispatch = useAppDispatch();
  const [displayTagForm, setDisplayTagForm] = useState(false);
  const [tagValue, setTagValue] = useState("");

  const newTag = (event: React.MouseEvent) => {
    setDisplayTagForm(true);
  };

  const displaySelection = (annotation: Annotation) => {
    const domEl = document.getElementById(annotation.messageRef);
    if (!highlighter) {
      return;
    }
    // Display selection here
    highlighter.highlightSelection("highlight", {
      containerElementId: annotation.messageRef,
      selection: null, //annotation.selection,
    });
  };

  // load annotations
  useEffect(() => {
    if (message && !selection && displayMode) {
      dispatch(loadAnnotations(message));
    }
  }, []);

  const createNewTag = () => {
    if (selection) {
      dispatch(
        newAnnotation({
          type: "tags",
          messageRef: message?.ref || "",
          selection,
          data: { value: tagValue },
        })
      );
    }
  };

  const handleTag = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagValue(event.target.value);
  };

  const handeMedataChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(">>>");
    const value = console.log(event.target.value);
    console.log("Seelect>>>", selection);
    //selection
    //mask
  };

  return (
    <div
      className="layers-editor"
      style={{
        width: "50%",
        float: "right",
        height: "100%",
        border: "1px solid orange",
        textAlign: "left",
        background: "white",
        padding: "5px",
        margin: "5px",
      }}
    >
      <div className="content">
        <p>Current Selection:</p>
        <p className="mb-5">
          <em>{selection?.content}</em>
        </p>
        <br />
        <div className="red-border mb-5">
          <p className="flex justify-between">
            <span className="flex">
              <MdOutlineVisibility />
              Key Value Data{" "}
            </span>

            <a className="red-border flex p-5 align-center" onClick={newTag}>
              +
            </a>
          </p>
          <div className="red-border">
            {selectedMessageAnnotations &&
              selectedMessageAnnotations.map((annotation) => {
                if (annotation.type == "tags") {
                  return (
                    <p
                      onClick={() => {
                        displaySelection(annotation);
                      }}
                    >
                      <span>
                        <strong>{annotation?.data?.value}</strong>
                      </span>
                      : <span>{annotation.selection.content}</span>
                    </p>
                  );
                }
              })}
          </div>
        </div>
        <select onChange={handeMedataChange}>
          <option value=":ref">REF</option>
          <option value=":pers">Personnage</option>
          <option value=":year">Année</option>
          <option value=":editor">Editeur</option>
          <option value=":author">Auteur</option>
          <option value=":editor">Editeur</option>
          <option value=":editor">Editeur</option>
        </select>
        <p className="red-border mb-5 flex justify-between">
          <span>Personnage</span>,<span>Strange</span>
          <span className="flex">
            <MdOutlineVisibility />
            label
          </span>
          <input className="red-border" />
          <a className="red-border flex align-center p-5" onClick={newTag}>
            +
          </a>
        </p>

        <p className="red-border mb-5">
          <span>
            <MdOutlineVisibility />
          </span>
          Comment
        </p>

        <p className="red-border mb-5">
          <span>
            <MdOutlineVisibility />
          </span>
          Relation
        </p>
        <ContentSearchField searchHandler={searchHandler}></ContentSearchField>
      </div>
    </div>
  );
};
