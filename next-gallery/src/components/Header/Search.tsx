import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Search {
  onClose: () => void;
}

const suggestions = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Grape",
  "Orange",
  "Strawberry",
];

const Search: React.FC<Search> = ({ onClose }) => {
  const { t } = useTranslation(); // Initialize translation hook
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const filteredSuggestions = suggestions.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (filteredSuggestions.length > 0 && query && showSuggestions) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [query, filteredSuggestions, showSuggestions]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div className="w-96" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          {/* Search bar */}
          <div
            className={`bg-white w-full p-3 flex items-center shadow-lg transition-all duration-300 ease-out ${
              isVisible ? "rounded-t-3xl rounded-b-none" : "rounded-3xl"
            }`}
          >
            <input
              type="text"
              placeholder={t("search.placeholder")} // Use translation key for placeholder
              value={query}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 outline-none text-gray-800 bg-transparent placeholder-gray-400 text-base ml-2"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-xl text-gray-600 mr-2 cursor-pointer hover:text-gray-800"
            />
          </div>

          {/* Suggestions dropdown */}
          <div
            className="w-full bg-white rounded-b-3xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform origin-top"
            style={{
              maxHeight: isVisible
                ? `${filteredSuggestions.length * 40 + 8}px`
                : "0px",
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "scaleY(1) translateY(0)"
                : "scaleY(0) translateY(-10px)",
              visibility: isVisible ? "visible" : "hidden",
            }}
          >
            {showSuggestions && query && filteredSuggestions.length > 0 && (
              <div className="flex flex-col">
                {filteredSuggestions.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-800"
                    onClick={() => {
                      setQuery(item);
                      setShowSuggestions(false);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
