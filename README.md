# homework-ml
`This is currently a stub and work-in-progress README. TODO`

**Problem Statement:** I don't like doing online homework.

**Answer Statement:** Spend way more time writing a machine learning algo to do my homework for me.

This is a monorepo* containing other repos managed with workspaces, with some subrepos actually being
git submodules. To update the submodules as needed, use `git submodule update --recursive`

### File Directory
* <b>question-scraper</b>
  Scrapes .mhtml files of webpages to reformat in a .JSON format to utilize in training some ML algo.
  * <b>input</b> Submodule linked to [`https://github.com/codyduong/homework-ml-input`](https://github.com/codyduong/homework-ml-input)
  * <b>output</b> Submodule linked to `TODO`
* <b>question-generator</b> (TODO)
  * Writes .JSON files from known question prompts with answers to train ML algo.
* ml
  * STUB
