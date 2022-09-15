import { useFetcher } from "@remix-run/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "~/components/Buttons";
import { Input } from "~/components/Input";
import { Select } from "~/components/Select";
import { serializeArrayString } from "~/helpers/string_arrays";
import { QuestionType } from "~/types";
import type { MinimalQuestion } from "../../../components/Question";

export default function QuestionForm({
  questions,
}: {
  questions: MinimalQuestion[];
}) {
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
      setAnswerOptions([]);
    }
  }, [hasSubmission]);

  const lastItem = questions[questions.length - 1];
  const position = lastItem ? lastItem.position + 1 : 1000;

  const sendAnswerOptions = questionType === QuestionType.multipleChoice;

  return (
    <fetcher.Form
      method="post"
      style={{ opacity: hasSubmission ? 0.25 : 1 }}
      replace
      ref={formRef}
      className="flex flex-col gap-2"
    >
      <label>
        <div>Question type:</div>
        <Select value={questionType} name="type" onChange={changeQuestionType}>
          <option value={QuestionType.freeForm}>
            Free form (anything goes)
          </option>
          <option value={QuestionType.multipleChoice}>Multiple Choice</option>
        </Select>
      </label>
      <div>
        <label>
          <div>Question:</div>
          <Input type="text" name="questionText" />
        </label>
      </div>
      <div>
        <label>
          <div>Answer:</div>
          <Input type="text" name="answer" />
        </label>
      </div>
      {questionType === QuestionType.multipleChoice && (
        <div>
          <label>
            Answer options:
            <div className="flex flex-col gap-1">
              {answerOptions.map((option) => (
                <div key={option}>
                  <Input type="text" value={option} readOnly className="mr-2" />
                  <Button
                    aria-label={`Remove answer option ${option}`}
                    onClick={() => removeAnswerOption(option)}
                    kind="alert"
                  >
                    X
                  </Button>
                </div>
              ))}
              <div>
                <Input
                  type="text"
                  key="EMPTYONE"
                  onKeyDown={addAnswerOption}
                  placeholder="Add a new answer option"
                />
              </div>
            </div>
          </label>
        </div>
      )}
      <div>
        <label>
          <div>Points:</div>
          <Input type="number" name="points" defaultValue={1} required />
        </label>
      </div>
      {sendAnswerOptions ? (
        <Input
          type="hidden"
          name="answerOptions"
          value={serializeArrayString(answerOptions)}
        />
      ) : null}
      <Input type="hidden" name="position" value={position} />
      <div className="mt-2">
        <Button type="submit" className="button" disabled={hasSubmission}>
          Add
        </Button>
      </div>
    </fetcher.Form>
  );
}
