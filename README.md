# actions-labeled-duration

[![test](https://github.com/piyoppi/actions-labeled-duration/actions/workflows/ci.yml/badge.svg)](https://github.com/piyoppi/actions-labeled-duration/actions/workflows/ci.yml)

Calculate the labeled duration and comment on the GitHub Issue.

![summary](./images/README_summary.png)

## Build

```
npm run build
```

## Usage

```yml
- uses: piyoppi/actions-labeled-duration@cc59fe06e7f8ce93dff689efc1bdc87ae29e28ac # (A commit hash containing the Actions you want to use.)
  with:
    # Tracking labels (Splitted comma)
    labels: label1,label2

    # Tracking project columns (Splitted comma)
    project_columns: TODO,Doing

    # Additional issue comment
    issue_comment: 'The time taken to close this Issue is as follows.'

    # Target issue number(default: current issue number)
    issue_number: 1
```

## Outputs

### `labeled_duration_details`

Details about the time it took to solve the issue (JSON string).

```json
{
  "issue": {
    "number": 1,
    "title": "Issue title",
    "labels": ["label1"],
    "createdAt": "2021-08-26T14:38:16Z",
    "closedAt": "2021-08-29T14:05:46Z"
  },
  "labeledDurations": {
    "label1": {
      "name": "label1",
      "durationMinute": 10,
      "durationDisplayed": "0 h 10 min (0 day)"
    }
  },
  "projectStateDurations": {
    "TODO": {
      "name": "TODO",
      "durationMinute": 210,
      "durationDisplayed": "3 h 30 min (0 day)"
    },
    "Doing": {
      "name": "Doing",
      "durationMinute": 35,
      "durationDisplayed": "0 h 35 min (0 day)"
    }
  }
}
```

## Sample

### Comments on total time labeled

```yml

name: issue-closed

on:
  issues:
    types:
      - closed

jobs:
  closed:
    runs-on: ubuntu-latest
    steps:
      - name: Report
        id: report
        uses: piyoppi/actions-labeled-duration@cc59fe06e7f8ce93dff689efc1bdc87ae29e28ac
        with:
          labels: Todo,Doing
          issue_comment: '⌛It shows how long the state of the project is taking.'
```

### Comment on the total time spent on the project

```yml
name: issue-closed

on:
  issues:
    types:
      - closed

jobs:
  closed:
    runs-on: ubuntu-latest
    steps:
      - name: Report
        id: report
        uses: piyoppi/actions-labeled-duration@cc59fe06e7f8ce93dff689efc1bdc87ae29e28ac
        with:
          project_columns: Todo,Doing
          issue_comment: '⌛It shows how long the state of the project is taking.'
```

### Output the result as a JSON file

Here is an example of writing the output results to an `issue-tracked` branch.

```yml
name: issue-closed

on:
  issues:
    types:
      - closed

jobs:
  closed:
    runs-on: ubuntu-latest
    steps:
      - name: Report
        id: report
        uses: piyoppi/actions-labeled-duration@cc59fe06e7f8ce93dff689efc1bdc87ae29e28ac
        with:
          labels: label1,label2
          project_columns: Todo,Doing
          issue_comment: '⌛It shows how long the state of the project is taking.'
          issue_number: ${{ github.event.inputs.issue_number }}
      - name: Checkout
        uses: actions/checkout@v2
        with:
          ref: issue-tracked
      - name: write
        shell: bash
        env:
          OUTPUTTED_CONTENT: ${{ steps.report.outputs.labeled_duration_details }}
        run: |
          git config --global user.email "bot@garakuta-toolbox.com"
          git config --global user.name "piyoppi-bot"
          branch='issue-tracked'
          dir='./issue-tracked'
          if [ ! -d $dir ]; then
            mkdir $dir
          fi
          echo $OUTPUTTED_CONTENT > "$dir/${{ github.event.issue.number }}.json"
          git add .
          git commit -m "add / replace ${{ github.event.issue.number }}.json"
```

## License

The scripts in the [/src](src/) directory and documents of this project are released under the [MIT License](LICENSE).

The artifacts in the [/dist](dist/) directory created by this project contain third party material. For licensing and other copyright information, see [dist/licenses.txt](dist/licenses.txt).
