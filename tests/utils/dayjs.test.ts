import { expect, test } from "vitest";
import { parseRelativeTime } from "../../src/utils";

const RELATIVE_DATE_DATA = [
  "10 hour ago",
  "12 hour ago",
  "1 hour ago",
  "1 minute ago",
  "2 minute ago",
  "15 minute ago",
  "30 minute ago",

  "10 hours ago",
  "12 hours ago",
  "1 hours ago",
  "1 minutes ago",
  "2 minutes ago",
  "15 minutes ago",
  "30 minutes ago",
];

test.each(RELATIVE_DATE_DATA)("should parse relative date %s", (date) => {
  const parsed = parseRelativeTime(date);

  expect(parsed.isValid()).toBe(true);
});
