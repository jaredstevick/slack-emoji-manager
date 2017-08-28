import React from 'react';
import forEach from 'lodash/collection/forEach';
import map from 'lodash/collection/map';
import last from 'lodash/array/last';
import JSZip from 'jszip';
import fileSaver from 'file-saver';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      emojis: [],
      loading: true,
      downloadComplete: false,
    };
  }
  componentDidMount() {
    this.generateEmojis();
    window.alert('Hooray, Slack Emoji Manager loaded successfully. Now scroll down and look for the bulk upload and download sections.');
  }
  generateEmojis() {
    const rows = document.getElementsByClassName('emoji_row');
    const emojis = [];

    forEach(rows, (row) => {
      const trimmedName = /^:([a-z0-9\-_]+):/i.exec(row.innerText);
      const trimmedUrl = /(https?:\/\/.*\.(png|jpg|gif))/.exec(row.cells[0].children[0].outerHTML);

      emojis.push({
        name: trimmedName[1],
        url: trimmedUrl[1],
        ext: `.${last(trimmedUrl)}`,
      });
    });

    this.setState({
      emojis,
      loading: false,
    });
  }
  downloadEmojis() {
    const { emojis } = this.state;

    this.setState({ loading: true });
    // for each emoji, send a request
    // when the request comes back, add that file's data to zip
    // when the last one is done, download the zip

    Promise.all(
      map(emojis, e => new Promise((resolve) => {
        const x = new XMLHttpRequest();
        x.open('GET', e.url);
        x.responseType = 'blob';
        x.onload = () => {
          const blob = x.response;
          const fr = new FileReader();
          fr.onloadend = () => {
            const buffer = fr.result;
            resolve({ name: e.name + e.ext, buffer });
          };
          fr.readAsArrayBuffer(blob);
        };
        x.send();
      })),
    )
      .then((buffers) => {
        const zip = new JSZip();
        forEach(buffers, ({ name, buffer }) => {
          zip.file(name, buffer);
        });
        return zip.generateAsync({ type: 'blob' });
      })
      .then((content) => {
        fileSaver.saveAs(content, 'emojis.zip');
        this.setState({
          loading: false,
          downloadComplete: true,
        });
      });
  }
  render() {
    const {
      emojis,
      loading,
      downloadComplete,
    } = this.state;

    return (
      <div className="download">
        <h4>Bulk Emoji Download</h4>
        {!downloadComplete ? (
          !loading ? (
            <div>
              <p>
                Generate and download a zip file containing all{' '}
                {emojis.length} of your emojis for this Slack group.
              </p>
              <a
                className="btn btn_primary"
                onClick={() => this.downloadEmojis()}
              >
                Download Emojis
              </a>
            </div>
          ) : (
            <div>
              <p>
                <span
                  role="img"
                  aria-label="Hourglass"
                >
                  ⌛
                </span>
                {' '}Downloading... Please be patient. It may take a while...{' '}
                <span
                  role="img"
                  aria-label="Hourglass"
                >
                  ⌛
                </span>
              </p>
            </div>
          )
        ) : (
          <p>
            <span
              role="img"
              aria-label="Clap"
            >
              👏
            </span>
            {' '}Successfully Downloaded Emojis!{' '}
            <span
              role="img"
              aria-label="Clap"
            >
              👏
            </span>
          </p>
        )}
      </div>
    );
  }
}
