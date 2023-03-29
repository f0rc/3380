import { trpc } from "./utils/trpc";

export function Greeting() {
  const greeting = trpc.greeting.hello.useQuery();

  return <div>hello {greeting.data?.greeting}</div>;
}
