import CreatedEditedLabel from '../components/CreatedEditedLabel';

export default {
  title: 'Components/CreatedEditedLabel',
  component: CreatedEditedLabel,
};

const currentTimestamp = Math.floor(Date.now() / 1000);

export const CreatedOnly = () => (
  <CreatedEditedLabel created={currentTimestamp} />
);

export const CreatedAndEdited = () => (
  <CreatedEditedLabel created={currentTimestamp - 3600} edited={currentTimestamp} />
);
