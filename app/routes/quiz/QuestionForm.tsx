import { useFetcher } from "@remix-run/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { QuestionType } from "~/types";

export default function QuestionForm() {
  const fetcher = useFetcher();
  const hasSubmission = !!fetcher.submission;
  const [questionType, setQuestionType] = useState(QuestionType.freeForm);
  const [answerOptions, setAnswerOptions] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const changeQuestionType = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setQuestionType(event.currentTarget.value as QuestionType);
    },
    []
  );

  const addAnswerOption = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        const newOption = event.currentTarget.value;
        event.currentTarget.value = "";
        setAnswerOptions((options) => [...options, newOption]);
        event.preventDefault();
      }
    },
    []
  );

  const removeAnswerOption = useCallback((option: string) => {
    setAnswerOptions((_answerOptions) =>
      _answerOptions.filter((_option) => _option !== option)
    );
  }, []);

  useEffect(() => {
    if (hasSubmission) {
      formRef.current?.reset();
    }
  }, [hasSubmission]);

  return (
    <fetcher.Form
      method="post"
      style={{ opacity: hasSubmission ? 0.25 : 1 }}
      replace
      ref={formRef}
    >
      <label>
        Question type:{" "}
        <select value={questionType} onChange={changeQuestionType}>
          <option value={QuestionType.freeForm}>
            Free form (anything goes)
          </option>
          <option value={QuestionType.multipleChoice}>Multiple Choice</option>
        </select>
      </label>
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
          <label>
            Answer options:{" "}
            {answerOptions.map((option) => (
              <div key={option}>
                <input type="text" value={option} />
                <button onClick={() => removeAnswerOption(option)}>X</button>
              </div>
            ))}
            <div>
              <input
                type="text"
                key="EMPTYONE"
                onKeyDown={addAnswerOption}
                placeholder="Add a new answer option"
              />
            </div>
          </label>
        </div>
      )}
      <div>
        <label>
          Points: <input type="numer" name="points" defaultValue={1} />
        </label>
      </div>
      {answerOptions.length ? (
        <input
          type="hidden"
          name="answerOptions"
          value={answerOptions.join("||")}
        />
      ) : null}
      <div>
        <button type="submit" className="button" disabled={hasSubmission}>
          Add
        </button>
      </div>
    </fetcher.Form>
  );
}
