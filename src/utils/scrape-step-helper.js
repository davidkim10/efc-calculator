// This is not used in the project. It's just a helper to scrape the form data from the website.
// I Used it in the web inspector/console but seems like we need to better understand the dynamic questions first.
// Leaving it here for now in case I need it later.

function scrape() {
  function getInputType(question) {
    const select = question.querySelector('select');
    const radio = question.querySelector('input[type="radio"]');
    const text = question.querySelector('input[type="text"]');
    const el = [select, radio, text].filter(Boolean)[0];
    const tagName = el.tagName;
    return {
      tagName,
      type: tagName === 'INPUT' ? el.type : 'select',
    };
  }

  const questions = Array.from(document.querySelectorAll('app-question')).reduce(
    (acc, question, i) => {
      const label = question.querySelector('label').innerText;
      const { type, tagName } = getInputType(question);
      let id;
      let options;
      if (type === 'radio') {
        id = null;
        const selector = `[type=${type}]`;
        options = Array.from(question.querySelectorAll(selector)).map(({ value, id }) => {
          return { id, value };
        });
      }

      if (type === 'text') {
        id = question.querySelector(tagName).id;
      }

      if (type === 'select') {
        id = question.querySelector(type).id;
        options = Array.from(question.querySelector(type).options).map(({ value }, i) => {
          return { value };
        });
      }

      return {
        ...acc,
        [`question${i + 1}`]: {
          label,
          input: {
            type,
            id,
            options,
          },
        },
      };
    },
    {}
  );

  return questions;
}
