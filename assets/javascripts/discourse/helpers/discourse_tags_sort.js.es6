import { registerUnbound } from 'discourse-common/lib/helpers';
import renderTags from "../lib/render-tags";

export default registerUnbound("discourse-tags-sort", function(topic, params) {
  return new Handlebars.SafeString(renderTags(topic, params));
});
