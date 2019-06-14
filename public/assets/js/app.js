//functionality for dropdown buttons
$('.dropdown-toggle').dropdown()

var dropdownItem = $('.dropdown-item')
var entree = $('.form-control');

dropdownItem.click(function () {

  //Displays entree choices upon selecting a category.
  if ($(this).parent().siblings().text() === 'Category') {
    $.get(`/category/${$(this).text()}`, function (res) {
      console.log(res);
      console.log(res.message[0].Menu_Items[0].menu_item)
      for (i = 0; i < res.message.length; i++) {
        for (j = 0; j < res.message[i].Menu_Items.length; j++)
          var currentEntree = res.message[i].Menu_Items[j].menu_item;
         entree.append(`<option class='entree-options'>${currentEntree}</option>`)
      }
    })
  }

  //Displays entree choices upon selecting a restaurant.
  if ($(this).parent().siblings().text() === 'Restaurants') {
    $.get(`/restaurant/${$(this).text()}`, function (res) {
      console.log(res)
      var entree = $('.form-control');
      for (i = 0; i < 1; i++) {
        for (j = 0; j < res.message.Menu_Items.length; j++)
          var currentEntree = res.message.Menu_Items[j].menu_item;
          entree.append(`<option class='entree-options'>${currentEntree}</option>`)
      }
    })
  }
  $('#entree').show()
  // entree.empty();
});


//Displays recipe and ingredients upon selecting an entree.
entree.change(function() {
  $.get(`/menu_item/${$(this).val()}` , function(res) {
    $('#ingredients').append('<ul id="ingredient-list">')
    console.log(res.message);
    for (let i = 0; i < res.message.Recipes.length; i++){
      let ingredient = res.message.Recipes[i].ingredient;
      // console.log(ingredient);
      if(ingredient == null) {
        $('#recipe').append(`<p>${res.message.Recipes[i].instruction}</p>`);
      } else {
        $('#ingredient-list').append(`<li>${ingredient}</li>`);
      }
    }
    $('#ingredients').show();
    $('#recipe').show();
  })
  entree.empty();
})

//functionality for adding restaurant info form
var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form ...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  // ... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  // ... and run a function that displays the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form... :
  if (currentTab >= x.length) {
    //...the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false:
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}

//functionality for creating post routes for new items
var nextCount = 3;
var restaurantId = 0;
var menu_item_Id = 0;
$("#nextBtn").click(function () {
  if (nextCount === 3) {
    nextCount -= 1;
    var newRestaurant = {
      restaurant_name: $("#newRestaurant").val(),
      restaurant_category: $("#newRestaurantCat").val()
    }
    $.post("api/restaurant", newRestaurant).then(function (result) {
      restaurantId = result.result.id;
    }).catch(error => { throw error });
  } else if (nextCount === 2) {
    nextCount -= 1;
    var newMenu_Item = {
      menu_item: $("#newMenuItem").val(),
      RestaurantId: restaurantId
    }
    $.post(`/api/menu_item/${restaurantId}`, newMenu_Item).then(function (result) {
      console.log(result);
      menu_item_Id = result.result.id;
    }).catch(error => { throw error });
  }
  else if (nextCount === 1) {
    nextCount = 3;
    var ingList = $("#ingredientsInput").val().split(','); //note to Kevin: was let and worked

    for (var i = 0; i < ingList.length; i++) {
      var newIng = ingList[i];
      var newIngredient = {
        ingredient: newIng,
        instruction: null,
        MenuItemId: menu_item_Id
      };
      $.post("api/recipe/:menu_item_id", newIngredient).then(function () {
      }).catch(error => { throw error });
    }
    var instructionOne = $('#stepOne').val();
    var instructionTwo = $('#stepTwo').val();
    var instructionThree = $('#stepThree').val();
    var instructionArr = [instructionOne, instructionTwo, instructionThree];

    for (var i = 0; i < instructionArr.length; i++) {
      var newInst = instructionArr[i];
      var newInstruction = {
        ingredient: null,
        instruction: newInst,
        MenuItemId: menu_item_Id
      };
      $.post("api/recipe/:menu_item_id", newInstruction).then(function () {
        }).catch(error => { throw error });
    }
  }
});
