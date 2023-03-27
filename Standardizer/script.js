function csvJSON(csv) {
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].split(",");
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  return result;
}

$(document).ready(function () {


  $('#coatab').on('click', function () { location.reload(); });

    $('.MainNavbarButtons').on('click', function () {
      $('.MainNavbarButtons').removeClass('active'); // remove active class from all buttons
      $(this).addClass('active'); // add active class to clicked button

      // find corresponding button in destination navbar by button-link-value attribute
      var buttonLinkValue = $(this).attr('button-link-value');
      var correspondingButton = $('.destination_navabr button[button-link-value="' + buttonLinkValue + '"]');

      // trigger click event on corresponding button to make it active
      correspondingButton.click();
    });



  // Select the destination account section divs
  var MostLikelyDiv = $("#MostLikely");
  var LikelyDiv = $("#Likely");
  var PossiblesDiv = $("#Possibles");

  var currentButtonValue = null; // keep track of the currently active button value
  // Load the CSV data
  $.get("./Files/Standard CofA (1).csv", function (csvData) {
    // Convert to JSON
    var SourceData = csvJSON(csvData);
    // Get the scrollable div element for the data
    var SourceDiv = $("#SourceAccountStructure");
    SourceDiv.empty(); // clear any previous data
    // Loop through the data array
    for (var i = 0; i < SourceData.length; i++) {
      var data = SourceData[i];
      // Check if the 'type' field matches the button value
      if (
        data.hasOwnProperty("Number") &&
        data.Number !== "" &&
        data.hasOwnProperty("Name") &&
        data.Name !== ""
      ) {
        // create a new <div> element with the desired text
        var text = data.Number + "  " + data.Name;
        var iconTick = $("<i>")
          .addClass("material-icons")
          .text("done_all")
          .css("margin-left", "4px");
        var iconhistory = $("<i>")
          .addClass("material-icons")
          .text("history")
          .css("margin-left", "4px");
        var iconsContainer = $("<div>").append(iconTick).append(iconhistory);
        var Sourcelist = $("<div>")
          .addClass("Masterclass TextClass")
          .css("display", "flex")
          .css("justify-content", "space-between");
        var textContainer = $("<div>")
          .text(text)
          .addClass("TextContainer")
          .css({
            overflow: "hidden",
            "white-space": "nowrap",
            "text-overflow": "ellipsis",
          });
        var rowID = data.Number; // create a unique row ID based on data number
        Sourcelist.attr("id", rowID); // set the ID of the new <div> element
        Sourcelist.append(textContainer).append(iconsContainer).css({
          overflow: "hidden",
          "white-space": "nowrap",
        });

        // Append the new <div> element to the scrollable div
        SourceDiv.append(Sourcelist);

        // Add a new sortable container with the row ID as its ID to each destination account section div
        var newDiv = $("<div>");
        var mostLikelyDiv = newDiv
          .clone()
          .addClass("mostlikely_sortable_container")
          .attr("id", "mostlikely_" + rowID)
          .attr("data-destination", "mostlikely"); // add data-destination attribute
        var likelyDiv = newDiv
          .clone()
          .addClass("likely_sortable_container")
          .attr("id", "likely_" + rowID)
          .attr("data-destination", "likely"); // add data-destination attribute
        var possiblesDiv = newDiv
          .clone()
          .addClass("possibles_sortable_container")
          .attr("id", "possibles_" + rowID)
          .attr("data-destination", "possibles"); // add data-destination attribute

        mostLikelyDiv
          .outerHeight(Sourcelist.outerHeight())
          .outerWidth(MostLikelyDiv.outerWidth());
        likelyDiv.outerHeight(Sourcelist.outerHeight());
        possiblesDiv.outerHeight(Sourcelist.outerHeight());

        MostLikelyDiv.append(mostLikelyDiv);
        LikelyDiv.append(likelyDiv);
        PossiblesDiv.append(possiblesDiv);
      }
    }
    var masterlist = document.getElementById("DestinationAccountStructure");
    new Sortable(masterlist, {
      group: {
        name: "shared",
        pull: "clone",
        put: false,
      },
      animation: 150,
      sort: false, // To disable sorting: set sort to false
      onClone: function (clone) {
      
      }
    });
    
  
    $(".mostlikely_sortable_container").each(function () {

      new Sortable(this, {
        group: "shared",
        animation: 150,
        onAdd: function (evt) {
          debugger
          evt.item.classList = "sort_mostlikely";
          var parentContainer = evt.item.parentNode;

          var destination = parentContainer
            .getAttribute("id")
            .substring(parentContainer.getAttribute("id").indexOf("_"));

          var destinationNew = parentContainer
            .getAttribute("id")
            .substring(parentContainer.getAttribute("id").indexOf("_") + 1);

          var possible = document.getElementById("possibles" + destination);
          var likely = document.getElementById("likely" + destination);
          var source = document.getElementById(destinationNew);

          if (parentContainer.children.length == 1) {
            source.style.color = "rgb(66 175 219)";
            if ((likely.children.length == 1 &&
              likely.children[0].innerText ==
              parentContainer.children[0].innerText) ||
              (possible.children.length == 1 &&
                possible.children[0].innerText ==
                parentContainer.children[0].innerText)) {
              swal("Account already Exists", "Kindly Check Again", "error", {
                button: "Ok!",
              });
              parentContainer.removeChild(evt.item);
            }
          }

          else if (parentContainer.children.length > 1) {
            if (
              parentContainer.children[0].innerText ==
              parentContainer.children[1].innerText ||
              (likely.children.length == 1 &&
                likely.children[0].innerText ==
                parentContainer.children[0].innerText) ||
              (possible.children.length == 1 &&
                possible.children[0].innerText ==
                parentContainer.children[0].innerText)
            ) {
              swal("Account already Exists", "Kindly Check Again", "error", {
                button: "Ok!",
              });
              parentContainer.removeChild(evt.item);
            }

            else {
              var secondItem = parentContainer.children[1];

              if (likely.children.length == 0) {
                likely.appendChild(secondItem);
              } else if (likely.children.length == 1) {
                likely.appendChild(secondItem);

                if (possible.children.length == 0) {
                  var secondlikelychild = likely.children[0];
                  possible.appendChild(secondlikelychild);
                } else if (possible.children.length == 1) {
                  possible.children[0].remove();
                  var secondlikelychild = likely.children[0];
                  possible.appendChild(secondlikelychild);
                }
              }
            }
          }
        },
      });

    });

    $(".likely_sortable_container").each(function () {
      new Sortable(this, {
        group: "shared",
        animation: 150,

        onAdd: function (evt) {

          evt.item.classList = "sort_likely";
          var parentContainer = evt.item.parentNode;
          var destination = parentContainer
            .getAttribute("id")
            .substring(parentContainer.getAttribute("id").indexOf("_"));
          var mostlikely = document.getElementById("mostlikely" + destination);
          var possibles = document.getElementById("possibles" + destination);

          var destinationNew = parentContainer
          .getAttribute("id")
          .substring(parentContainer.getAttribute("id").indexOf("_") + 1);

          var source = document.getElementById(destinationNew);

          if (parentContainer.children.length == 1) {
            source.style.color = "rgb(66 175 219)";
            if ((mostlikely.children.length == 1 &&
              mostlikely.children[0].innerText ==
              parentContainer.children[0].innerText) ||
              (possibles.children.length == 1 &&
                possibles.children[0].innerText ==
                parentContainer.children[0].innerText)) {
              swal("Account already Exists", "Kindly Check Again", "error", {
                button: "Ok!",
              });
              parentContainer.removeChild(evt.item);
            }
          }

          if (parentContainer.children.length > 1) {
            if (parentContainer.children[0].innerText ==
              parentContainer.children[1].innerText ||
              (mostlikely.children.length == 1 &&
                mostlikely.children[0].innerText ==
                parentContainer.children[0].innerText) ||
              (possibles.children.length == 1 &&
                possibles.children[0].innerText ==
                parentContainer.children[0].innerText)) {
              swal("Account already Exists", "Kindly Check Again", "error", {
                button: "Ok!",
              });
              parentContainer.removeChild(evt.item);
            }
            else {
              var secondItem = parentContainer.children[1];
              var destination = parentContainer
                .getAttribute("id")
                .substring(parentContainer.getAttribute("id").indexOf("_"));

              if (possibles.children.length == 0) {
                possibles.appendChild(secondItem);
              } else if (possibles.children.length == 1) {
                possibles.appendChild(secondItem);
                var possibleschild = possibles.children[0];
                possibleschild.remove();
              }
            }

          }
        },
      });
    });

    $(".possibles_sortable_container").each(function () {
      new Sortable(this, {
        group: "shared",
        animation: 150,
        onAdd: function (evt) {
          evt.item.classList = "sort_possible";
          var parentContainer = evt.item.parentNode;
          var destination = parentContainer
            .getAttribute("id")
            .substring(parentContainer.getAttribute("id").indexOf("_"));

            var destinationNew = parentContainer
            .getAttribute("id")
            .substring(parentContainer.getAttribute("id").indexOf("_") + 1);
          var mostlikely = document.getElementById("mostlikely" + destination);
          var likely = document.getElementById("likely" + destination);
          var source = document.getElementById(destinationNew);


          if (parentContainer.children.length == 1) {
            source.style.color = "rgb(66 175 219)";
            if ((mostlikely.children.length == 1 &&
              mostlikely.children[0].innerText ==
              parentContainer.children[0].innerText) ||
              (likely.children.length == 1 &&
                likely.children[0].innerText ==
                parentContainer.children[0].innerText)) {
              swal("Account already Exists", "Kindly Check Again", "error", {
                button: "Ok!",
              });
              parentContainer.removeChild(evt.item);
            }
          }

          if (parentContainer.children.length > 1) {
            if (parentContainer.children[0].innerText ==
              parentContainer.children[1].innerText ||
              (mostlikely.children.length == 1 &&
                mostlikely.children[0].innerText ==
                parentContainer.children[0].innerText) ||
              (likely.children.length == 1 &&
                likely.children[0].innerText ==
                parentContainer.children[0].innerText)) {
              swal("Account already Exists", "Kindly Check Again", "error", {
                button: "Ok!",
              });
              parentContainer.removeChild(evt.item);
            }
            else {
              parentContainer.children[1].remove();
            }


          }
        },
      });
    });


    // Add click event handlers to the buttons
    $("#mainnavabar button").click(function () {
      $("#mainnavabar button").removeClass("active");
      $(this).addClass("active");
      var buttonValue = $("#mainnavabar .btn.active").attr("account-type");

      // hide all the existing divs inside the scrollable div
      SourceDiv.children().hide();
      MostLikelyDiv.children().hide(); // hide most likely destination divs
      LikelyDiv.children().hide(); // hide likely destination divs
      PossiblesDiv.children().hide(); // hide possible destination divs
      // Loop through the data array and show/hide the divs as appropriate
      for (var i = 0; i < SourceData.length; i++) {
        var data = SourceData[i];
        if (
          data.hasOwnProperty("Type") &&
          data.Type === buttonValue &&
          data.hasOwnProperty("Number") &&
          data.Number !== "" &&
          data.hasOwnProperty("Name") &&
          data.Name !== ""
        ) {
          $("#" + data.Number).show(); // show the source div
          $("#mostlikely_" + data.Number).show(); // show the most likely destination div
          $("#likely_" + data.Number).show(); // show the likely destination div
          $("#possibles_" + data.Number).show();
        }
      }
    });


    if (localStorage.getItem("Standardizer")) {
      debugger
      // Retrieve the data from the local storage
      var Standardizer = JSON.parse(localStorage.getItem("Standardizer"));

      // Loop through the data object and set the text content of the respective divs
      for (var i = 0; i < Standardizer.length; i++) {
        var data = Standardizer[i];
        var likelyElem = document.getElementById("likely_" + data.DataNumber);
      var sourceElm = document.getElementById(data.DataNumber);
        var mostlikelyElem = document.getElementById(
          "mostlikely_" + data.DataNumber
        );
        var possiblesElem = document.getElementById(
          "possibles_" + data.DataNumber
        );
        $(".lastupdated").text("Last Updated on " +  data.Date + " at " + data.Time );
        
        // Create child elements if they don't exist
        if (!likelyElem.children[0] && data.LikelyLocalData !== "") {
          var likelyChild = document.createElement("div");
          likelyChild.classList.add("sort_likely");
          likelyChild.setAttribute("draggable", "false");
          likelyElem.appendChild(likelyChild);
          likelyElem.children[0].innerHTML = data.LikelyLocalData;
          sourceElm.style.color = "rgb(66 175 219)";
        }
        if (!mostlikelyElem.children[0] && data.MostLikelyLocalData !== "") {
          var mostlikelyChild = document.createElement("div");
          mostlikelyChild.classList.add("sort_mostlikely");
          mostlikelyChild.setAttribute("draggable", "false");
          mostlikelyElem.appendChild(mostlikelyChild);
          mostlikelyElem.children[0].innerHTML = data.MostLikelyLocalData;
          sourceElm.style.color = "rgb(66 175 219)";
        }
        if (!possiblesElem.children[0] && data.PossibleData !== "") {
          var possiblesChild = document.createElement("div");
          possiblesChild.classList.add("sort_possible");
          possiblesChild.setAttribute("draggable", "false");
          possiblesElem.appendChild(possiblesChild);
          possiblesElem.children[0].innerHTML = data.PossibleData;
                   sourceElm.style.color = "rgb(66 175 219)";
        }
      }
    }

    $("#submit").click(function () {
      var now = new Date();
      var date = now.toLocaleDateString();
      var time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      $(".lastupdated").text("Last Updated on " + date + " at " + time);
      // Initialize an empty array to store the data objects
      var Standardizer = [];
      for (var i = 0; i < SourceData.length; i++) {
        var data = SourceData[i];
        if (data.Number !== "") {
          var MostLikelyLocalData = "";
          var MostLikelyElem = document.getElementById(
            "mostlikely_" + data.Number
          ).children[0];
          if (MostLikelyElem && MostLikelyElem.hasChildNodes()) {
            MostLikelyLocalData = MostLikelyElem.innerText;
          }
          var LikelyLocalData = "";
          var LikelyElem = document.getElementById("likely_" + data.Number)
            .children[0];
          if (LikelyElem && LikelyElem.hasChildNodes()) {
            LikelyLocalData = LikelyElem.innerText;
          }
          var PossibleData = "";
          var PossibleElem = document.getElementById("possibles_" + data.Number)
            .children[0];
          if (PossibleElem && PossibleElem.hasChildNodes()) {
            PossibleData = PossibleElem.innerText;
          }
          // Create a data object with the data and date/time information
          var dataObject = {
            DataNumber: data.Number,
            MostLikelyLocalData: MostLikelyLocalData,
            LikelyLocalData: LikelyLocalData,
            PossibleData: PossibleData,
            Date: date,
            Time: time,
          };
          Standardizer.push(dataObject);
        }
      }
      // Save the Standardizer array in local storage
      localStorage.setItem("Standardizer", JSON.stringify(Standardizer));
      swal("Account mapping succesfull", "Thank you!", "success", {
        button: "Ok!",
      });
    });
  });

  $.get("./Files/MasterChartOfAcounts - Sheet1.csv", function (csvData) {
    // Convert to JSON
    var MasterData = csvJSON(csvData);
    // Get the scrollable div element
    var MasterDiv = $("#DestinationAccountStructure");
    // Clear the div before adding new data
    MasterDiv.empty();
    // Loop through the masterdata array
    for (var i = 0; i < MasterData.length; i++) {
      // Get the current object
      var data = MasterData[i];
      // Check if Number and Name properties exist and are not empty, and if AccountTypeName matches buttonValue
      if (
        data.hasOwnProperty("AccountCode") &&
        data.AccountCode !== "" &&
        data.hasOwnProperty("AccountName") &&
        data.AccountName !== "" &&
        data.hasOwnProperty("AccountTypeName")
      ) {
        // <div> element with the desired text
        var text = "⠿" + " " + data.AccountCode + "--" + data.AccountName;
        var Masterlist = $("<div>").text(text).addClass("DestinationClass");
        // Append the new <p> element to the scrollable div
        MasterDiv.append(Masterlist);
      }
    }
    $("#MasterlistSearch").on("input", function () {
      var value = $(this).val().toLowerCase();
      MasterDiv.children(".DestinationClass").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  });

  $(".destination_navabr .btn").click(function () {
    $(".destination_navabr button").removeClass("active");
    $(this).addClass("active");
    if ($(this).attr("account-type-name") == "All") {
      buttonValue = "";
    } else {
      buttonValue = $(".destination_navabr .active").attr("account-type-name").toLowerCase();
    }
    $.get("./Files/MasterChartOfAcounts - Sheet1.csv", function (csvData) {
      // Convert to JSON
      var MasterData = csvJSON(csvData);
      // Get the scrollable div element
      var MasterDiv = $("#DestinationAccountStructure");
      // Clear the div before adding new data
      MasterDiv.empty();
      // Loop through the masterdata array
      for (var i = 0; i < MasterData.length; i++) {
        // Get the current object
        var data = MasterData[i];
        // Check if Number and Name properties exist and are not empty, and if AccountTypeName matches buttonValue
        if (
          data.hasOwnProperty("AccountCode") &&
          data.AccountCode !== "" &&
          data.hasOwnProperty("AccountName") &&
          data.AccountName !== "" &&
          (buttonValue == "" || data.AccountTypeName.toLowerCase().includes(buttonValue))
        ) {
          // <div> element with the desired text
          var text = "⠿" + " " + data.AccountCode + "--" + data.AccountName;
          var Masterlist = $("<div>").text(text).addClass("DestinationClass").attr("id",data.AccountCode);
          // Append the new <p> element to the scrollable div
          MasterDiv.append(Masterlist);
        }
      }
      $("#MasterlistSearch").on("input", function () {
        var value = $(this).val().toLowerCase();
        MasterDiv.children(".DestinationClass").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
      });
    });
  });

});

function scrollButtonsContainer(value) {
  console.log();
  $("#ButtonsContainer").scrollLeft($("#ButtonsContainer").scrollLeft() + Math.floor(value));
}
