import renderTag from "discourse/lib/render-tag";

let callbacks = null;
let priorities = null;

export function addTagsHtmlCallback(callback, options) {
  callbacks = callbacks || [];
  priorities = priorities || [];
  const priority = (options && options.priority) || 0;

  let i = 0;
  while (i < priorities.length && priorities[i] > priority) {
    i += 1;
  }

  priorities.splice(i, 0, priority);
  callbacks.splice(i, 0, callback);
}

export default function(topic, params) {
  let tags = topic.tags;
  let buffer = "";
  let tagsForUser = null;
  let tagName;

  const isPrivateMessage = topic.get("isPrivateMessage");

  if (params) {
    if (params.mode === "list") {
      tags = topic.get("visibleListTags");
    }
    if (params.tagsForUser) {
      tagsForUser = params.tagsForUser;
    }
    if (params.tagName) {
      tagName = params.tagName;
    }
  }

  var getTagGroups = function() {
  let tagInfo=false
  var xhr = new XMLHttpRequest();
    var url='/tag_groups.json'
    
    xhr.open('GET', url,false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
   
    xhr.onload = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          console.log("aaaaaaaaaaaaaaaaaaa")
          tagInfo = JSON.parse(xhr.responseText);
          console.log(tagInfo)
        }
     };
    xhr.send();
    return tagInfo
  };


  let customHtml = null;
  if (callbacks) {
    callbacks.forEach(c => {
      const html = c(topic, params);
      if (html) {
        if (customHtml) {
          customHtml += html;
        } else {
          customHtml = html;
        }
      }
    });
  }

  if (customHtml || (tags && tags.length > 0)) {
  console.log("00000000000000000000000000000000000000")
  console.log(getTagGroups())
  console.log("00000000000000000000000000000000000000")
  var tagGroups = getTagGroups()
  console.log(tagGroups.tag_groups)
  for (let i = 0; i < tagGroups.tag_groups.length; i++) {
    console.log("99999999999999999999999")
    console.log(tagGroups.tag_groups[i].name)
  }
  buffer = "<div class='discourse-tags'>";
  if (tags) {
  if (tagGroups){
  var tag_list = ""
  for(let i = 0; i < tagGroups.tag_groups.length; i++){
    let intersection = tagGroups.tag_groups[i].tag_names.filter(x => tags.includes(x));
    if (intersection.length > 0){
      var temp = ""
      for(let i = 0; i < intersection.length; i++){
        temp += '<a href="/tags/'+intersection[i]+'" data-tag-name="'+intersection[i]+'" class="discourse-tag simple">'+intersection[i]+'</a>'
      }
      buffer+= " " + tagGroups.tag_groups[i].name + " : " + temp
    }
    for(let j=0; j < intersection.length; j++){
      console.log("============")
      console.log(tags)
      console.log("============")
      tags = tags.filter(item => item !== intersection[j])
    }

    console.log(tags)
  }

      for (let i = 0; i < tags.length; i++) {
        if (tags[i]){
          buffer +=
          renderTag(tags[i], { isPrivateMessage, tagsForUser, tagName }) + " ";
        }
        }

    }


    if (customHtml) {
      buffer += customHtml;
    }

    buffer += "</div";
  }
  }
  return buffer;
}
