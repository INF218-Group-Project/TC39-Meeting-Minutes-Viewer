import React from "react";
import { AppBar, Toolbar, Button, TextField } from "@mui/material";
import Autocomplete, {
  createFilterOptions,
  AutocompleteRenderGroupParams,
} from "@mui/material/Autocomplete";
import { styled, useTheme } from "@mui/material/styles";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ChatIcon from "@mui/icons-material/Chat";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CodeIcon from "@mui/icons-material/Code"; // Icon for the execute command

interface AppBarComponentProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
  handleClearMessages: () => void;
  handleSelectOption: (selectedOption: string) => void;
  updateFilePath: (filePath: string) => void; // Accept this prop
  updateTabs: (tab: string) => void;
}

interface Option {
  label: string;
  id: number;
  category: string;
  isCommand?: boolean; // Optional property to identify command options
}

// Styles for group headers
const GroupHeader = styled("div")(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[900],
  fontWeight: theme.typography.fontWeightMedium,
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow:
    theme.palette.mode === "light"
      ? "0px 2px 4px rgba(0,0,0,0.1)"
      : "0px 2px 4px rgba(255,255,255,0.1)",
  margin: theme.spacing(0.5, 0), // Adjust as needed
}));

const AppBarComponent: React.FC<AppBarComponentProps> = ({
  input,
  handleInputChange,
  handleSendMessage,
  handleClearMessages,
  handleSelectOption,
  updateFilePath,
  updateTabs,
}) => {
  const theme = useTheme();
  const themeMode = theme.palette.mode;

  const commandOption: Option = {
    label: "Execute link",
    id: -1, // Unique ID for the command option
    category: "Commands",
    isCommand: true,
  };

  const myDefaultOption = {
    label: "Search with GPT-3.5",
    id: 1,
    category: "ChatGPT",
  };

  const options: Option[] = [
    myDefaultOption,
    { label: "Topics", id: 2, category: "List" },
    { label: "Sentiment", id: 3, category: "Analysis" },
    { label: "Participants", id: 4, category: "List" },
    // Additional static options...
  ];

  const _filterOptions = createFilterOptions<Option>();
  const filterOptions = (options: Option[], state: any) => {
    const results = _filterOptions(options, state);

    if (!results.some((option) => option.isCommand)) {
      results.unshift(commandOption);
    }

    if (!results.includes(myDefaultOption)) {
      results.unshift(myDefaultOption);
    }

    return results;
  };

  const sortOptions = (options: any[]) => {
    return options.sort((a, b) => {
      // Sort primarily by category
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;
      // If categories are the same, optionally sort by label or any other property
      return a.label.localeCompare(b.label);
    });
  };

  // Usage before passing to Autocomplete
  const sortedOptions = sortOptions(options);

  return (
    <AppBar
      position="static"
      style={{
        ...(themeMode === "light" && {
          background: theme.palette.background.default,
        }),
        borderRadius: "20px",
        padding: "10px",
        marginLeft: "0%",
        width: "80.7vw",
      }}
    >
      <Toolbar>
        <Autocomplete
          disablePortal
          filterOptions={filterOptions}
          options={sortedOptions}
          groupBy={(option) => option.category}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="What do you want to know?"
              value={input}
              onChange={handleInputChange}
            />
          )} //if (value?.isCommand) {
          onChange={(_event, value) => {
            if (value && value.label === myDefaultOption.label) {
              handleSendMessage();
            }
            if (value) {
              handleSelectOption(value.label);
            }

            if (value?.isCommand) {
              const basePath = "../public/meetings/";
              let tabs = [];

              // Validate the base format of the input
              if (!input.startsWith("http://tc39/")) {
                console.error("Invalid input format");
                return;
              }

              // Split the input by '/' and capture the parts after "tc39/"
              const linker = input.replace("http://tc39/", "");
              const parts = linker.split("/");

              if (parts.length < 3) {
                console.error("Invalid input format");
                return;
              }

              const year = parts[0];
              let month = parts[1];
              const date = parts[2];

              // Year validation
              if (isNaN(parseInt(year, 10)) || year.length !== 4) {
                console.error("Invalid year format");
                return;
              }

              // Month and date validation
              if (isNaN(parseInt(date, 10))) {
                console.error("Invalid date format");
                return;
              }

              // Convert month to a number if it is numeric, otherwise keep the month name
              const monthNames = [
                "jan",
                "feb",
                "mar",
                "apr",
                "may",
                "jun",
                "jul",
                "aug",
                "sep",
                "oct",
                "nov",
                "dec",
              ];
              let monthNumber = parseInt(month, 10);
              let monthName = month;

              // Check if month is a number and within valid range
              if (
                !isNaN(monthNumber) &&
                monthNumber >= 1 &&
                monthNumber <= 12
              ) {
                monthName = monthNames[monthNumber - 1];
                month = month.padStart(2, "0");
              } else {
                monthNumber = monthNames.indexOf(month.toLowerCase()) + 1;
                if (monthNumber === 0) {
                  console.error("Invalid month format");
                  return;
                }
                month = monthNumber.toString().padStart(2, "0");
              }

              // Construct the file path
              const mdFileLink = `${basePath}${year}-${month}/${monthName}-${date}.md`;

              if (parts.length > 3) {
                // Starting from the 4th part, add remaining parts to the tabs list
                for (let i = 3; i < parts.length; i++) {
                  tabs.push(parts[i]);
                }
              }

              // Output for demonstration
              console.log("File path:", mdFileLink);
              console.log("Tabs:", tabs);

              // Your logic to use mdFileLink and tabs as needed

              // check if the mdFileLink is valid before updating the file path
              //check if the file exists with fetch

              fetch(mdFileLink)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("File not found");
                  }
                  return response.text();
                })
                .then(() => {
                  updateFilePath(mdFileLink);
                  if (
                    parts[3] &&
                    ["sentiment", "gpt", "persons", "topics"].includes(parts[3])
                  ) {
                    updateTabs(parts[3]);
                  }
                })
                .catch((error) => {
                  console.error("Error fetching file:", error);
                });
            }
          }}
          renderOption={(props, option) => (
            <li {...props}>
              {option.category === "Analysis" && (
                <AnalyticsIcon style={{ marginRight: 8 }} />
              )}
              {option.category === "ChatGPT" && (
                <ChatIcon style={{ marginRight: 8 }} />
              )}
              {option.category === "List" && (
                <FormatListNumberedIcon style={{ marginRight: 8 }} />
              )}
              {option.category === "Commands" && (
                <CodeIcon style={{ marginRight: 8 }} />
              )}
              {option.label}
            </li>
          )}
          renderGroup={(params: AutocompleteRenderGroupParams) => [
            <li key={params.key}>
              <GroupHeader>{params.group}</GroupHeader>
              <ul>{params.children}</ul>
            </li>,
          ]}
          sx={{ width: 950, zIndex: 100 }}
          inputValue={input}
        />
        <Button
          style={{ marginLeft: "50px" }}
          variant="contained"
          color="primary"
          onClick={handleClearMessages}
        >
          Clear
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
