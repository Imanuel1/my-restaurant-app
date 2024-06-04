import {
  CustomIconCloud,
  IconCloud,
} from "../../components/magicui/icon-cloud";
import { SparklesTextTitle } from "../../components/magicui/sparkles-text";
import "./LoadingPage.css";

const slugs = [
  "apacheguacamole",
  "burgerking",
  "justeat",
  "cakephp",
  "gamebanana",
  "charles",
  "codechef",
  "buymeacoffee",
  "rottentomatoes",
  "cocacola",
  "4chan",
  "adafruit",
  "aerlingus",
  "aiqfome",
];

export function LoadingPage() {
  return (
    <div className="c-loading-page relative flex h-full w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg border bg-background px-20 pb-20 pt-8 ">
      <IconCloud iconSlugs={slugs} />
      <h1>{"מסעדת אקע"}</h1>
      {/* <CustomIconCloud /> */}
    </div>
  );
}
