# Homework ML
`This is currently a stub and work-in-progress README. TODO`

**Problem Statement:** I don't like doing online homework.

**Answer Statement:** Spend way more time writing a machine learning algo to do my homework for me.

This is a monorepo* containing other repos managed with workspaces, with some subrepos actually being
git submodules. To update the submodules as needed, use `git submodule update --recursive`

### File Directory
* <b>question-scraper</b>
  Scrapes .mhtml files of webpages to reformat in a .JSON format to utilize in training some ML algo.
  * <b>input</b> A git submodule containing input files
  * <b>output</b> A git submodule automatically rebuilt containing output files
* question-generator (TODO)
  * Writes .JSON files from known question prompts with answers to train ML algo.
* ml
  * STUB
