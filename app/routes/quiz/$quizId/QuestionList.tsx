import { Form, useFetcher, useResolvedPath } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import type { IProps as MovableProps } from "react-movable";
import { List, arrayMove } from "react-movable";
import cx from "classnames";
import { Button } from "~/components/Buttons";
import { getNewPosition } from "~/helpers/get_new_position";
import type { MinimalQuestion } from "../../../components/Question";
import QuestionComponent from "../../../components/Question";
import { Card } from "~/components/Card";

export default function QuestionList({
  questions,
}: {
  questions: MinimalQuestion[];
}) {
  // We are using a local copy of the questions to prevent the list from
  // flickering back to the previous state while the update request is
  // in flight.
  const [localQuestions, setLocalQuestions] = useState(questions);

  // Update the local questions when we receive an update from the query
  useEffect(() => {
    setLocalQuestions(questions);
  }, [questions]);

  const { submit } = useFetcher();
  const { pathname } = useResolvedPath("update-question-position");

  // Update the positions locally and remotely
  const onChange = useCallback<MovableProps<MinimalQuestion>["onChange"]>(
    ({ oldIndex, newIndex }) => {
      const newPosition = getNewPosition({
        oldIndex,
        newIndex,
        items: localQuestions,
      });
      const data = new FormData();
      data.set("newPosition", newPosition.toString());
      data.set("questionId", localQuestions[oldIndex].id);
      submit(data, {
        method: "post",
        action: pathname,
      });
      setLocalQuestions(arrayMove(localQuestions, oldIndex, newIndex));
    },
    [localQuestions, submit, pathname]
  );

  // Keep stable references for the rendering in order to prevent unnecessary re-renders
  const renderList = useCallback<MovableProps<MinimalQuestion>["renderList"]>(
    ({ children, props }) => <ol {...props}>{children}</ol>,
    []
  );
  const renderItem = useCallback<MovableProps<MinimalQuestion>["renderItem"]>(
    ({ value, props, isSelected, isDragged }) => (
      <li
        {...props}
        className={cx(
          "py-2",
          "cursor-move",
          !isDragged && "list-decimal",
          isDragged && "bg-white opacity-90 list-none",
          "group"
        )}
      >
        <Card>
          <QuestionComponent {...value} />
          <Form
            method="post"
            replace
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-75 absolute right-2 bottom-4 cursor-default"
          >
            <input type="hidden" name="questionId" value={value.id} />
            <input type="hidden" name="_method" value="delete" />
            <Button type="submit" size="sm">
              Delete
            </Button>
          </Form>
        </Card>
      </li>
    ),
    []
  );

  return (
    <List
      lockVertically
      values={localQuestions}
      onChange={onChange}
      renderList={renderList}
      renderItem={renderItem}
    />
  );
}
