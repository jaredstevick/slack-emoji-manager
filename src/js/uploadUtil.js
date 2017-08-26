import superagent from 'superagent';
import each from 'lodash/collection/each';
import strip from 'strip';
import uuid from 'uuid';

function getHiddenFormData() {
  const add_emoji_form = document.querySelector('#addemoji');
  const hidden_form_data = {};
  each(add_emoji_form.elements, (element) => {
    if (element.type === 'hidden') {
      hidden_form_data[element.name] = element.value;
    }
  });
  return hidden_form_data;
}

function extractError(response_text) {
  const error_html = (/<p class="alert alert_error">(.*)<\/p>/.exec(response_text) || [])[1];
  const error_text = strip(error_html || '') || null;
  return error_text;
}

export function uploadEmoji(file, callback = () => {}) {
  const hidden_form_data = getHiddenFormData();
  const id = uuid.v4();
  const fileName = file.name.split('.')[0];

  const image_upload_request =
    superagent.post('/customize/emoji')
      .withCredentials()
      .field('name', fileName)
      .field('mode', 'data')
      .attach('img', file);

  each(hidden_form_data, (value, name) => {
    image_upload_request.field(name, value);
  });

  image_upload_request.end((error, response) => {
    const response_error = extractError(response.text);
    callback(response_error, response);
  });
  return id;
}
