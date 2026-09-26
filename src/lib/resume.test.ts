import { describe, expect, it } from "vitest";
import { getResumeHref } from "./resume";

describe("getResumeHref", () => {
  it("replaces an expired path-style B2 URL with a stable link", () => {
    expect(getResumeHref("https://s3.us-east-005.backblazeb2.com/dimnay-portfolio-data/site-images/resume.pdf?X-Amz-Expires=900"))
      .toBe("/api/resume?object_path=site-images%2Fresume.pdf");
  });

  it("handles a virtual-hosted B2 URL", () => {
    expect(getResumeHref("https://dimnay-portfolio-data.s3.us-east-005.backblazeb2.com/site-images/resume.docx?X-Amz-Expires=900"))
      .toBe("/api/resume?object_path=site-images%2Fresume.docx");
  });

  it("keeps other links unchanged", () => {
    expect(getResumeHref("https://example.com/resume.pdf")).toBe("https://example.com/resume.pdf");
  });
});
