Linking Charts and Adding Interactivity
This project demonstrates how to create interactive visualizations using JavaScript and D3.js. The application allows users to input text, which is then visualized through a treemap and a Sankey diagram. The treemap displays the frequency of characters in the text, while the Sankey diagram shows relationships between characters based on their order in the text.


Features
Dynamic Data Parsing: The application parses user input and creates a hierarchical dataset for visualization.
Treemap Visualization: Displays the distribution of character types (consonants, vowels, and punctuation) using a treemap.
Sankey Diagram: Shows character flow, illustrating which characters appear before and after a selected character.
Interactive Tooltips: Provides user feedback by displaying relevant information when hovering over visual elements.

Overview
The main interface consists of three panels:

Input Panel: Contains a textarea for text input and a submit button.
Treemap Panel: Displays a treemap visualizing the frequency of characters.
Sankey Diagram Panel: Shows character relationships based on the selected character from the treemap.

User Interaction

Input Text: Enter a string in the textarea.
Submit: Click the submit button to generate the treemap.
Select Character: Click on a rectangle in the treemap to display the corresponding Sankey diagram.
Hover for Tooltips: Hover over rectangles in both charts to see detailed information.

Data Description
The input data consists of:

Consonants: (bcdfghjklmnpqrstvwxz)
Vowels: (aeiouy) (Note: y is treated as a vowel)
Punctuation: (,.!?:;)

Implementation Steps
Step 1: Displaying a Treemap Chart
On page load, all panels are blank.
After submitting text, the treemap visualizes character frequencies and groups characters by type.
Rectangles are color-coded by character type and sized according to frequency.

Step 2: Displaying a Sankey Chart
Clicking a treemap rectangle loads a Sankey diagram in the third panel.
The Sankey diagram illustrates character relationships: left column for preceding characters, middle for the selected character, and right for succeeding characters.

Step 3: Adding Hover Tooltips
Tooltips provide information on character counts and relationships, following the mouse cursor for a smooth user experience.
