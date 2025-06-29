import { Box, Typography } from "@mui/material";
import React from "react";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: { children: React.ReactNode; }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, color: "red" }}>
          <Typography variant="h6">Something went wrong in the DataGrid Footer.</Typography>
          <pre>{this.state.error?.toString()}</pre>
        </Box>
      );
    }

    return this.props.children;
  }
}
