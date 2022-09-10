import { useFetcher, useResolvedPath } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import type { IProps } from "react-movable";
import { List, arrayMove } from "react-movable";
import type { MinimalQuestion } from "./Question";
import QuestionComponent from "./Question";

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
    console.log(questions.map((q) => q.position));
    setLocalQuestions(questions);
  }, [questions]);

  const { submit } = useFetcher();
  const { pathname } = useResolvedPath("update-question-position");

  // Update the positions locally and remotely
  const onChange = useCallback<IProps<MinimalQuestion>["onChange"]>(
    ({ oldIndex, newIndex }) => {
      const newPosition = getNewPosition({
        newIndex,
        questions: localQuestions,
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
  const renderList = useCallback<IProps<MinimalQuestion>["renderList"]>(
    ({ children, props }) => <ol {...props}>{children}</ol>,
    []
  );
  const renderItem = useCallback<IProps<MinimalQuestion>["renderItem"]>(
    ({ value, props }) => (
      <li {...props}>
        <QuestionComponent {...value} />
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

function getNewPosition({
  newIndex,
  questions,
}: {
  newIndex: number;
  questions: MinimalQuestion[];
}) {
  const itemBeforeIndex = newIndex - 1;
  const itemBefore = questions[newIndex - 1];
  if (!itemBefore) {
    return questions[0].position - 1;
  }
  const itemAfterIndex = newIndex + 1;
  const itemAfter = questions[newIndex + 1];
  if (!itemAfter) {
    return questions[questions.length - 1].position + 1;
  }
  const beforePosition = questions[itemBeforeIndex].position;
  const afterPosition = questions[itemAfterIndex].position;

  return beforePosition + (afterPosition - beforePosition) / 2;
}
