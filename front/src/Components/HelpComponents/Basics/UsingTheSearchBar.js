import React from "react";
import { Container } from "reactstrap";

const UsingTheSearchBar = () => {
  return (
    <div>
      <div>
        <h2>Using The Search Bar</h2>
      </div>
      <div className="mt-3">
        <p>
          Gadhimart uses filters to help you to narrow down on the vehicle you
          want. The first steps in this process is using the search bar. <br />
          There are 3 types of filters in the search bar.
        </p>
      </div>
      <div>
        <Container>
          <span className="heading">Make and Model</span>
          <p className="mt-2">
            To select a make, click into that section of the search bar. You can
            either type in the name of the brand or select from the list. Once
            you’ve selected your make and the model appering below. This will
            limit your searches to only that make and/or model.
          </p>
          <p>
            <b>Note:</b> The search bar does not accept keywords. Please only
            enter a make or model (or leave it blank to search all makes and
            models) and then use filters to find specific years, colours, etc.
          </p>
          <span className="heading mt-3">Max Price</span>
          <p className="mt-2">
            The maximum price should be set to the most you’re willing to pay
            for a vehicle. The results will show every vehicle listed below that
            price (that also fits your other filters). Remember, you can always
            negotiate down. If you choose too low a price, you may miss a great
            vehicle that could have been just on the edge of your price range.
          </p>
          <span className="heading mt-3">Max Kilometers</span>
          <p className="mt-2">
            Like price, this should be set to the highest number of kilometres
            that you’re willing to accept in a used car. Once set, you will only
            see vehicles that have fewer kilometres than what you’ve entered.
          </p>
        </Container>
      </div>
      <div>
        <p>
          You can only add or adjust the filters after starting your search.
          When you’re satisfied, click on Show Results to get started.
        </p>
      </div>
    </div>
  );
};

export default UsingTheSearchBar;
