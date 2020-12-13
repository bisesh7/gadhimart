import React from "react";

const SavedSearches = () => {
  return (
    <div>
      <div>
        <h2>Saved Searches</h2>
      </div>
      <div className="mt-3">
        <p>
          Saved searches are a great way to save time and still get in on the
          best deals. When you save a search, you’ll receive a notification to
          let you know how many new ads matched your search criteria.
        </p>
      </div>
      <div>
        <span className="heading">Saving Searches</span>
        <p>
          In the search result page, click the <b>Save Search</b> button to the
          right of the top.
        </p>
      </div>
      <div>
        <span className="heading">Deleting Saved Searches</span>
        <p>
          In the search result page, click the <b>Unsave Search</b> button to
          the right of the top.
        </p>
      </div>
      <div>
        <span className="heading">Removing Saved Ads</span>
        <p>
          In the Ad Detail page, click the yellow star icon to the right of the
          send message box. A solid star with no color indicates that it has
          been unsaved.
        </p>
      </div>
    </div>
  );
};

export default SavedSearches;
