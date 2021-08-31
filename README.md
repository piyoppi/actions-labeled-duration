# actions-labeled-duration

Issueのラベルを使って時間を計測するGitHub Actionsのサンプル

## Build

```
npm run build
```

## Usage

```yml
- uses: ./
  with:
    # Tracking labels (Splitted comma)
    labels: label1,label2

    # Tracking project columns (Splitted comma)
    project_columns: TODO,Doing

    # Additional issue comment
    issue_comment: 'The time taken to close this Issue is as follows.'
```

## Outputs

### `labeled_duration_details`

Details about the time it took to solve the issue (JSON string).

```json
{
  "issue": {
    "number": 1,
    "title": "Issue title",
    "labels": [],
    "createdAt": "2021-08-26T14:38:16Z",
    "closedAt": "2021-08-29T14:05:46Z"
  },
  "labeledDurations": [
    {
      "name": "label1",
      "durationMinute": 10
    }
  ],
  "projectStateDurations": [
    {
      "name": "TODO",
      "durationMinute": 210
    },
    {
      "name": "Doing",
      "durationMinute": 35
    }
  ]
}
```
