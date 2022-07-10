"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, deleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  //show favorite not favorite star
  const star = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
      ${deleteBtn ? getDeleteBtnHTML() : ""}
      ${star ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Make delete button HTML for story */

function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

/** Make favorite/not-favorite star for story */

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/* function that is called when user submits the form */
async function submitStory(evt) {
  evt.preventDefault();

  //get all data from story form that was entered in inputs
  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#url").val();
  const user = currentUser.username;
  const data = { author, title, url, user };

  //call the add story mehtod to get data to submit
  const story = await storyList.addStory(currentUser, data);
  console.log("stories line 67")

  const $story = generateStoryMarkup(story)

  $allStoriesList.prepend($story);


}
//add to display submit button to submit new story
$submitForm.on("submit", submitStory);

//I grabbed this from the solution
/******************************************************************************
 * Functionality for list of user's own stories
 */

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $userStory.empty();

  // loop through all of users stories and generate HTML for them
  for (let story of currentUser.userStory) {
    let $story = generateStoryMarkup(story, true);
    $userStory.append($story);
  }


  $userStory.show();
}