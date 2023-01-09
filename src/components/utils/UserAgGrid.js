import React from "react";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import { Box } from "@chakra-ui/react";

const UserAgGrid = (props) => {
  const {
    rowData,
    columnDefs,
    rowHeight = 80,
    filter = false,
    showbutton,
    preCourseAssessmentInfo,
    postCourseAssessmentInfo,
    scoreCompareInfo,
  } = props;

  const rowSelectionType = "multiple";
  const selectionChanged = (event) => {
    if (event.api.getSelectedRows()?.length > 0) {
      if (showbutton) {
        showbutton.setShowDeleteButton.on();
        showbutton.getUserIds(event.api.getSelectedRows());
      } else if (preCourseAssessmentInfo) {
        preCourseAssessmentInfo.setDownloadSelected.on();
        preCourseAssessmentInfo.getUserAssessmentInfo(event.api.getSelectedRows());
      } else if (postCourseAssessmentInfo) {
        postCourseAssessmentInfo.setDownloadSelected.on();
        postCourseAssessmentInfo.getUserAssessmentInfo(event.api.getSelectedRows());
      } else if (scoreCompareInfo) {
        scoreCompareInfo.setScoreComparisonDwdOpt.on();
        scoreCompareInfo.getScoreComparisonInfo(event.api.getSelectedRows());
      }
    } else {
      showbutton && showbutton.setShowDeleteButton.off();
      preCourseAssessmentInfo && preCourseAssessmentInfo.setDownloadSelected.off();
      postCourseAssessmentInfo && postCourseAssessmentInfo.setDownloadSelected.off();
      scoreCompareInfo && scoreCompareInfo.setScoreComparisonDwdOpt.off();
    }
  };
  return (
    <Box h="100%" w="100%">
      <Box h="100%" w="100%" id="myGrid" className="ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          rowHeight={rowHeight}
          animateRows={true}
          columnTypes={{
            filterableColumn: {
              filter: "agTextColumnFilter",
            },
            sortableColumn: {
              sortable: true,
              unSortIcon: true,
            },
            checkBoxSelection: {
              checkboxSelection: true,
              headerCheckboxSelection: true,
            },
            numberColumn: {
              width: 130,
              filter: filter ? "agNumberColumnFilter" : false,
            },
            editableColumn: { editable: true },
            dateColumn: {
              filter: filter ? "agDateColumnFilter" : false,
              filterParams: {
                comparator: function (filterLocalDateAtMidnight, cellValue) {
                  var dateParts = cellValue.split("/");
                  var day = Number(dateParts[0]);
                  var month = Number(dateParts[1]) - 1;
                  var year = Number(dateParts[2]);
                  var cellDate = new Date(year, month, day);
                  if (cellDate < filterLocalDateAtMidnight) {
                    return -1;
                  } else if (cellDate > filterLocalDateAtMidnight) {
                    return 1;
                  } else {
                    return 0;
                  }
                },
              },
            },
          }}
          onSelectionChanged={selectionChanged}
          rowSelection={rowSelectionType}
          suppressRowClickSelection={true}
        >
          {columnDefs &&
            columnDefs.map((c) => (
              <AgGridColumn
                cellRenderer={c.cellRenderer}
                key={`my-grid-col-${c.header}-for-${c.accessor}-${c.type}`}
                headerName={c.header}
                field={c.accessor}
                type={c.type || ""}
                width={c.width || 180}
                pinned={c.pinned || ""}
              />
            ))}
        </AgGridReact>
      </Box>
    </Box>
  );
};

export default UserAgGrid;
