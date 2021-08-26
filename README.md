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
    # Access token for read / write issues
    access-token: ${{ secrets.GITHUB_TOKEN }}

    # Tracking labels (Splitted comma)
    labels: label1,label2

    # Tracking project columns (Splitted comma)
    project_columns: TODO,Doing
```
