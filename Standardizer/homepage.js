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
  const section1Buttons = $("#navbarNav button");
  // Get all the buttons in Section 2
  const section2Buttons = $(".destination_navabr button");
  // Add an event listener to each button in Section 1
  section1Buttons.click(function () {
    section1Buttons.removeClass("active");
    $(this).addClass("active");
    const correspondingButton = $(
      `.destination_navabr button[value="${$(this).val()}"]`
    );
    section2Buttons.removeClass("active");
    correspondingButton.addClass("active");
    correspondingButton.click(); // trigger the click event for the corresponding button in Section 2
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
        var rowID =  data.Number; // create a unique row ID based on data number
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

        mostLikelyDiv.outerHeight(Sourcelist.outerHeight()).outerWidth(MostLikelyDiv.outerWidth());
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
    // onEnd: function(evt) {
    //   // Get the dragged element
    //   var item = evt.item;
      
    //   // Check if the element was dropped outside the container
    //   if (evt.to !== masterlist) {
    //     // Remove any class from the dragged element
    //     item.classList = "sort";
    //   }
    // }
  });
  
  $(".mostlikely_sortable_container").each(function () {
    new Sortable(this, {
      group: "shared",
      animation: 150,
      onAdd: function (evt) {
        var item = evt.item;
        var itemId = item.getAttribute('id');
        var parentContainerId = evt.item.parentNode.getAttribute('id');
        var destination = parentContainerId.substring(parentContainerId.indexOf('_')); // extract destination from parent container ID
   
        if (evt.item.parentNode.children.length == 2) {
          var firstItem = evt.item.parentNode.children[0];
          var likelyContainer = document.getElementById('likely' + destination);
          likelyContainer.appendChild(firstItem);
        }

      }
    });
  });

    $(".likely_sortable_container").each(function () {  
      new Sortable(this, {
        group: "shared",
        animation: 150,
        onAdd: function (evt) {
          var item = evt.item;
          var parentContainerId = evt.item.parentNode.getAttribute('id');
          var destination = parentContainerId.substring(parentContainerId.indexOf('_')); // extract destination from parent container ID
          if (evt.item.parentNode.children.length == 2) {
            var firstItem = evt.item.parentNode.children[0];
            var possibles = document.getElementById('possibles' + destination);
            possibles.appendChild(firstItem);
          }
        }
      });
    });

    $('.likely_sortable_container').on('DOMNodeInserted', function(e) {
      var containerID = $(this).attr('id');
      var destination = containerID.substring(containerID.indexOf('_'));
    
      // Get the number of child divs in the likely_sortable_container
      var numChildDivs = $(this).children();
      var numChildDivsLength = numChildDivs.length;
      var firstChildDiv = numChildDivs.first();
    
      // If there are more than 1 child divs, move the first child div to the corresponding possibles_sortable_container
      if (numChildDivsLength > 1) {
        console.log(firstChildDiv);
        var possibles_c = document.getElementById('possibles' + destination);
        possibles_c.appendChild(firstChildDiv[0]);
      }
    });
    
    $('.possibles_sortable_container').on('DOMNodeInserted', function(e) {
      var containerID = $(this).attr('id');
      var destination = containerID.substring(containerID.indexOf('_'));
        
      // Get the number of child divs in the likely_sortable_container
      var numChildDivs = $(this).children();
      var numChildDivsLength = numChildDivs.length;
      var firstChildDiv = numChildDivs.first();
        
      // If there are more than 1 child divs, move the first child div to the corresponding possibles_sortable_container
      if (numChildDivsLength > 1) {
        console.log(firstChildDiv);
        firstChildDiv.remove(); // Remove the first child div
      }
    });
    

    $(".possibles_sortable_container").each(function () {
      new Sortable(this, {
        group: "shared",
        animation: 150,
      });
    });

    // Add click event handlers to the buttons
    $("#navbarNav button").click(function () {
     
      $("#navbarNav button").removeClass("active");
      $(this).addClass("active");
      var buttonValue = $("#navbarNav .btn.active").val();
    
      if (buttonValue === currentButtonValue) {
        // the clicked button is already active, do nothing
        return;
      }
    
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
          // show the corresponding div
          var divIndex = i ; // index of the corresponding div is 1-based
          var sourceDiv = SourceDiv.children(":nth-child(" + divIndex + ")");
          sourceDiv.show();
    
          // show the corresponding destination div
          var destination = mostLikelyDiv.attr("data-destination");
          $("#" + destination + "_" + sourceDiv.attr("id")).show();

          var destination2 = likelyDiv.attr("data-destination");
          $("#" + destination2 + "_" + sourceDiv.attr("id")).show();

          
          var destination3 = possiblesDiv.attr("data-destination");
          $("#" + destination3 + "_" + sourceDiv.attr("id")).show();

        }
      }
      // update the current button value
      currentButtonValue = buttonValue;
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
    var buttonValue = $(".destination_navabr .active").val().toLowerCase();

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
          data.hasOwnProperty("AccountTypeName") &&
          data.AccountTypeName.toLowerCase().includes(buttonValue)
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
  });
  $(".toggle").click(function () {
    $(".nav").toggleClass("justify-content-end  ");
    $(".toggle").toggleClass("text-light");
  });
 

});


