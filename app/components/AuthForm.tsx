import { Form } from "@remix-run/react";
import { Button } from "./Buttons";
import { H2 } from "./Headlines";
import { Input } from "./Input";

export const AuthForm: React.FC<{ actionLabel: string; headline: string }> = ({
  actionLabel,
  headline,
}) => (
  <section>
    <H2>{headline}</H2>
    <div className="md:my-8">
      <Form method="post" className="flex flex-col max-w-xs mx-auto">
        <label htmlFor="name" className="my-1">
          Username:
        </label>
        <Input
          type="text"
          name="name"
          id="name"
          className="mb-2"
          required
          autoFocus
          minLength={3}
        />
        <label htmlFor="password" className="my-1">
          Password:
        </label>
        <Input
          type="password"
          name="password"
          id="password"
          autoComplete="current-password"
          className="mb-4"
          required
          minLength={4}
        />
        <div className="self-end">
          <Button>{actionLabel}</Button>
        </div>
      </Form>
    </div>
  </section>
);
