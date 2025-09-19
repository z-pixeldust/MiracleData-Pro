# PRD: Figma Plugin — Spreadsheet → Variables Importer

## Overview
The plugin allows users to import spreadsheet data (CSV, XLSX, Google Sheets) into the Figma Variables table. It includes column/row mapping, previews, error handling, and the ability to ignore irrelevant spreadsheet data.  

---

## Problem Statement
- Many spreadsheets include extra metadata (notes, instructions, calculated fields) that aren’t relevant to Figma Variables.  
- Without filtering, users may need to clean spreadsheets before importing.  
- Giving users control over **ignoring rows and columns** reduces friction and errors.  

---

## Goals (Updated)
1. Import spreadsheet data into Figma Variables.  
2. Support mapping of spreadsheet columns to Figma Variables fields.  
3. **Allow users to specify which columns and rows to ignore before import.**  
4. Provide preview with error highlighting.  
5. Support create or update workflows for variables.  

---

## Functional Requirements  

### Spreadsheet Import
- Accept file types: `.csv`, `.xlsx` (Google Sheets via URL optional in v2).  
- Parse first row as **headers** (column names).  

### Mapping & Preview
- Display spreadsheet in a **preview grid**.  
- Users can:  
  - **Toggle off columns** (checkbox in header row).  
  - **Ignore specific rows** (checkbox per row, or by specifying a rule: "ignore first N rows", "ignore blank rows").  
  - Visual indicator for ignored rows/columns (greyed out).  
- Allow drag-and-drop column-to-field mapping for non-ignored columns.  
- Highlight invalid values (e.g., non-hex color for type=color).  

### Import & Update
- Same as before, but ignored rows/columns are excluded from mapping and summary.  
- Import summary must include:  
  - # of variables imported  
  - # of variables updated  
  - # skipped due to ignore rules  

### UI Flow (Updated)
1. Upload/select spreadsheet.  
2. **Ignore step**: user selects rows/columns to skip.  
3. Map remaining columns → Figma fields.  
4. Preview table with ignored rows/columns hidden or greyed out.  
5. Import summary.  

---

## Technical Requirements
- Preview grid implemented with virtual scrolling for large sheets.  
- Ignore state stored in a mapping config JSON:  
  ```json
  {
    "ignoreRows": [1, 2, 15],
    "ignoreColumns": ["Notes", "Internal ID"]
  }
  ```  
- Ignored data excluded before transformation into Figma Variable schema.  

---

## Success Metrics
- User can exclude irrelevant data in < 2 clicks.  
- 0 ignored rows/columns imported into Variables.  
- 90%+ of users report not needing to edit spreadsheets before importing.  

---

## Future Enhancements
- Rule-based ignore filters (e.g., “ignore if column = empty” or “ignore rows with label ‘draft’”).  
- Persistent import profiles (remember ignore + mapping rules for future imports).  
- Regex or conditional filters for advanced users.  
