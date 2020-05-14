# Books Service

## Getting Started

Firstly, install the project dependencies:

```
$ npm install
```

#### Deployment

Start by getting your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` by signing into [AWS IAM](https://console.aws.amazon.com/console/home?nc2=h_ct&src=header-signin)

Now execute the following command by replacing the parameters appropriately to set up your environment:

```
$ serverless config credentials --provider aws --key [AWS_ACCESS_KEY_ID] --secret [AWS_SECRET_ACCESS_KEY]
```

Next, to deploy the serverless functions, run:

```
$ npm run deploy
```

The endpoints to all the functions will be available in the terminal
