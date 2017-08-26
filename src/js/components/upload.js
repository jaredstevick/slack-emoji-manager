import React from 'react';
import findIndex from 'lodash/array/findIndex';
import Dropzone from 'react-dropzone';
import { uploadEmoji } from '../uploadUtil';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      queue: [],
    };
  }
  onDrop(files = []) {
    files.forEach((file, i) => {
      const id = uploadEmoji(file, (error) => {
        const queue = [...this.state.queue];
        const index = findIndex(queue, upload => upload.id === id);
        const current_upload = queue[i];

        queue[index] = {
          ...current_upload,
          error,
          success: !error,
        };

        this.setState({ queue });
      });

      setTimeout(() => {
        this.setState({
          queue: [
            ...this.state.queue,
            {
              id,
              file,
              success: null,
              error: null,
            },
          ],
        });
      }, 100);
    });
  }
  renderUploads() {
    return this.state.queue.map((upload) => {
      const status = upload.success ?
        'Complete' :
        upload.error ?
          'Error' :
          'Uploading';

      return (
        <li
          key={upload.id}
          className="file-row"
        >
          <img
            className="upload-preview"
            src={upload.file.preview}
            alt="Preview"
          />
          <span className="upload-filename">{upload.file.name}</span>
          <span className="upload-status">
            {status === 'Uploading' ? (
              <span className="uploading">
                <span
                  role="img"
                  aria-label="Hourglass"
                >
                  ⌛
                </span>
                {' '}Loading...
              </span>
            ) : null}
            {status === 'Complete' ? (
              <span className="upload-success">
                <span
                  role="img"
                  aria-label="Checkmark"
                >
                  ✔︎
                </span>
                {' '}Success
              </span>
            ) : null}
            {status === 'Error' ? (
              <span className="upload-error">
                <span
                  role="img"
                  aria-label="Warning"
                >
                  ⚠
                </span>
                {' '}Failure
              </span>
            ) : null}
          </span>
        </li>
      );
    });
  }
  render() {
    return (
      <div className="upload">
        <h4 className="upload-heading">Bulk Emoji Upload</h4>
        <p className="upload-subheading">
          Drag and drop images into the area below. Any images dropped
          there will be automatically uploaded using their filename as
          the emoji name.
        </p>
        <p className="upload-help">
          Example: "fakenews.gif" will be added as ":fakenews:"
        </p>
        <Dropzone
          className="upload-dropzone"
          activeClassName="upload-dropzone-active"
          onDrop={files => this.onDrop(files)}
        >
          <p className="dropzone-hint">
            <strong>Drop images here</strong> or click to open the file picker
          </p>
        </Dropzone>
        <ul className="uploads">
          {this.renderUploads()}
        </ul>
      </div>
    );
  }
}
