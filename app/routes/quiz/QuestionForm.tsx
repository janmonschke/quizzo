import { useFetcher } from "@remix-run/react";
import React, { useCallback, useState } from "react";
import { QuestionType } from "~/types";

export default function QuestionForm() {
  const fetcher = useFetcher();
  const hasSubmission = !!fetcher.submission;
  const [questionType, setQuestionType] = useState(QuestionType.freeForm);
  const [questionOptions, setQuestionOptions] = useState<string[]>([]);

  const changeQuestionType = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setQuestionType(event.currentTarget.value as QuestionType);
    },
    []
  );

  const addQuestion = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        const newOption = event.currentTarget.value;
        setQuestionOptions((options) => [...options, newOption]);
        event.preventDefault();
      }
    },
    []
  );

  return (
    <fetcher.Form
      method="post"
      style={{ opacity: hasSubmission ? 0.25 : 1 }}
      replace
    >
      <select value={questionType} onChange={changeQuestionType}>
        <option value={QuestionType.freeForm}>Free form (anything goes)</option>
        <option value={QuestionType.multipleChoice}>Multiple Choice</option>
      </select>
      <div>
        <label>
          Question: <input type="text" name="questionText" />
        </label>
      </div>
      <div>
        <label>
          Answer: <input type="text" name="answer" />
        </label>
      </div>
      {questionType === QuestionType.multipleChoice && (
        <div>
          {questionOptions.map((option) => (
            <input type="text" value={option} key={option} />
          ))}
          <input type="text" key="EMPTYONE" onKeyDown={addQuestion} />
        </div>
      )}
      <div>
        <label>
          Points: <input type="numer" name="points" defaultValue={1} />
        </label>
      </div>
      <div>
        <button type="submit" className="button" disabled={hasSubmission}>
          Add
        </button>
      </div>
    </fetcher.Form>
  );
}
