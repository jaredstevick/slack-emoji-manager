import React from 'react';
import '../../img/neutral.png';
import '../../img/kane-clap.gif';
import '../../img/nice.gif';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      slackGroupName: '',
      submitted: false,
    };
  }
  render() {
    const { slackGroupName, submitted } = this.state;

    return (
      <div className="popup">
        <h1>Hey!</h1>
        <h3>Welcome to Slack Emoji Manager</h3>
        <div className="main-content">
          <div>
            <span
              role="img"
              aria-label="Yay"
            >
              🎉
            </span>
            <span className="congrats">
              Congrats on installing the extension successfully.
              You're about to be a hero in your Slack group.
            </span>
            <span
              role="img"
              aria-label="Yay"
            >
              🎉
            </span>
          </div>
          <div className="image">
            {!submitted ? (
              <img
                src="nice.gif"
                height="200px"
                alt="Nice"
              />
            ) : (
              <img
                src="kane-clap.gif"
                height="200px"
                alt="Clapping"
              />
            )}
          </div>
          <div className="help-text">
            {!submitted ? (
              <div>
                <p>
                  <span
                    role="img"
                    aria-label="Point Down"
                  >
                    👇
                  </span>
                  <span>
                    {' '}To get started, enter the name of your Slack group below
                  </span>
                </p>
                <p>
                  <input
                    type="text"
                    value={slackGroupName}
                    placeholder="👉 Enter your Slack group name here 👈"
                    onChange={e => this.setState({ slackGroupName: e.target.value })}
                    style={{ width: '75%' }}
                  />
                </p>
                <button
                  type="button"
                  disabled={slackGroupName.length < 1}
                  onClick={() => this.setState({ submitted: true })}
                >
                  Submit
                </button>
              </div>
            ) : (
              <div>
                <p>Now, navigate to: </p>
                <p>
                  <a
                    className="link"
                    target="_blank"
                    href={`https://${slackGroupName}.slack.com/customize/emoji`}
                  >
                    {`https://${slackGroupName}.slack.com/customize/emoji`}
                  </a>
                </p>
                <p>and wait for the page to load</p>
                <button
                  onClick={() => this.setState({
                    slackGroupName: '',
                    submitted: false,
                  })}
                >
                  Choose another Slack group
                </button>
                <p>
                  <span>Please enjoy responsibily. </span>
                  <span
                    role="img"
                    aria-label="Point Down"
                  >
                    😏
                  </span>
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }
}
