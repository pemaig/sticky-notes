# Project Architecture Overview

## Core Components

### 1. Canvas Component (Parent)
- Acts as the main container and state manager
- Manages global state including notes collection, note IDs, and UI state (settings modal)
- Handles note creation logic with starting position and size
- Renders the background container and all `Note` components

### 2. Note Component (Child)
- Manages its own local state for position and size during interactions
- Implements custom pointer event handlers for drag and resize operations
- Uses refs to track real-time interaction data without causing re-renders
- Uses CSS transform to optimize re-renders
