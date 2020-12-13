import React from "react";
import { Container } from "reactstrap";

const UsingTheSearchFilters = () => {
  return (
    <div>
      <div>
        <h2>Using The Search Filters</h2>
      </div>
      <div className="mt-3">
        <p>
          Whether you’re browsing just to see what’s out there or narrowing in
          on that perfect vehicle with precision, knowing how to use the full
          power of our search filters will make browsing for your next vehicle
          more easier.
        </p>
      </div>
      <div>
        <span className="heading">Accessing Filters</span>
        <p>
          Once you’ve hit search, you’ll be redirected to the search results
          page. Along the left side of this page, you’ll see a list of filters.
          This is where the tools to enhance your power searching comes into
          play. You can select a price range, body type, transmission,
          drivetrain, and more.
        </p>
      </div>
      <span className="heading">Selecting Location</span>
      <div>
        <ol>
          <li>
            At the top of the page, click <b>Set Location</b>.
          </li>
          <li>
            Select your province and district from the respective dropdown.
            Click search to let it load.
          </li>
        </ol>
        <span>
          <b>Note:</b> If you want to search all Nepal, remove province and
          district entirely and then click on the search button.
        </span>
      </div>
      <div className="mt-2">
        <span className="heading">Selecting Your Filters</span>
        <p>
          You can select as many filters as you’d like or leave them blank.
          Blank filters have no effect on your searches, so if you don’t have a
          preference, you don’t have to choose an option for every filter.
        </p>
      </div>
      <span className="heading">Selecting A Trim</span>
      <p>
        The trim field will allow you to type in any trim you’d like. Please
        make sure that you’re entering in the trim exactly as it’s written by
        the manufacturers.
      </p>
    </div>
  );
};

export default UsingTheSearchFilters;
