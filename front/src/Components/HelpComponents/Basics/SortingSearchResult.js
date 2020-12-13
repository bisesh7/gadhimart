import React from "react";
import { Container } from "reactstrap";

const SortingTheSearchResult = () => {
  return (
    <div>
      <div>
        <h2>Sorting The Search Results</h2>
      </div>
      <div className="mt-3">
        <p>
          The sorting option determines the order of your search results in the
          queues. These are the options:
        </p>
      </div>
      <Container>
        <div>
          <span className="heading">Most Recent</span>
          <p>
            The Most Recent option arranges ads from the newest ads to the
            oldest.
          </p>
          <span className="heading">Low Price</span>
          <p>
            The Low Price option orders your search results from the cheapest
            price to the most expensive.
          </p>
          <span className="heading">Low Kilometer</span>
          <p>
            The Low Kilometer option arranges ads from the lowest kilometers to
            the highest.
          </p>
          <span className="heading">Year: new to old</span>
          <p>
            The Year: new to old option arranges ads from the latest year to the
            oldest.
          </p>
          <span className="heading">Year: old to new</span>
          <p>
            The Year: old to new option arranges ads from the oldest year to the
            latest.
          </p>
        </div>
      </Container>

      <span className="heading">To choose a sorting option:</span>
      <div>
        <ol>
          <li>Begin a search.</li>
          <li>
            Click on the sorting button in the top right corner of the results
            list. By default, this button will say <b>Most Recent</b>.
          </li>
          <li>
            After clicking on the button, you will see options appear. Select
            the one you’d like to use. Your results will re-sort automatically.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default SortingTheSearchResult;
