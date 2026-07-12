import { createAsync, query } from '@solidjs/router';
import { fetchTrackers } from './api';

const getTrackers = query(fetchTrackers, 'trackers');

const AboutData = () => {
  return createAsync(() => getTrackers());
};

export default AboutData;
// export type AboutDataType = typeof AboutData;
