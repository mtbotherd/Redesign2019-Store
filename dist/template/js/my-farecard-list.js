"use strict";

/* Global object for My Fare Card List logic.
* 2019-11-29 changts
* */
var mfcl = {
  // Handlebars compiled templates for the grid cells
  compiledTemplates: {
    serial: Handlebars.compile(['<div class="serial-field d-flex flex-column">', '<span class="mt-serial">{{Record.SerialNumber}}</span>', '<a href="javascript:void(0)" data-serial="{{SerialNumberOnly}}" onclick="mfcl.action(this)" data-command="remove-card" id="remove-card-{{SerialNumberOnly}}">Remove</a>', '<span class="mt-last-used-on">Last Used: {{Card.LastUsedOn}}</span>', '{{#if Record.HasShoppingCartItem}}', '<div class="mt-has-cart-item">', '<img src="/content/site/img/icon/silk/cart.png" alt="There is an item in your shopping cart for this card." />', '</div>', '{{/if}}', '</div>'].join('')),
    nickname: Handlebars.compile(['<div class="nickname-field">', '<span>{{Record.NickName}}</span>', '<label for="nickname-{{SerialNumberOnly}}" class="sr-only">Nickname</label>', '<input id="nickname-{{SerialNumberOnly}}" name="I[{{SerialNumberOnly}}].N" type="text" value="{{Record.NickName}}" maxlength="50" data-serial="{{SerialNumberOnly}}" onkeypress="mfcl.onNicknameKeyPress(event, this)" />', '<div class="d-flex flex-row">', '<a href="javascript:void(0)" data-serial="{{SerialNumberOnly}}" onclick="mfcl.action(this)" data-command="edit-nickname"   id="edit-nickname-{{SerialNumberOnly}}">Edit</a>', '<a href="javascript:void(0)" data-serial="{{SerialNumberOnly}}" onclick="mfcl.action(this)" data-command="save-nickname"   id="save-nickname-{{SerialNumberOnly}}">Save</a>', '<a href="javascript:void(0)" data-serial="{{SerialNumberOnly}}" onclick="mfcl.action(this)" data-command="cancel-nickname" id="cancel-nickname-{{SerialNumberOnly}}" class="ml-3">Cancel</a>', '</div>', '</div>'].join('')),
    value: Handlebars.compile(['<div class="value-field d-flex flex-column">', '<div class="current-value">', '{{currency Card.CurrentStoredValue}}', '{{#if Card.LowStoredValueAlert}}', '<img src="/content/site/img/icon/silk/error.png" alt="Stored value amount is getting low." />', '{{/if}}', '</div>', '{{#if Card.CannotAddValueOrPass}}', '{{else}}', '{{#if Card.BuyableStoredValue.length}}', '<div class="add-value">', '<label for="I[{{SerialNumberOnly}}].V" class="sr-only">Add value</label>', '<select id="I[{{SerialNumberOnly}}].V" name="I[{{SerialNumberOnly}}].V">', '<option value="">Add value</option>', '{{#each Card.BuyableStoredValue}}', '{{#if Selected}}', '<option value="{{Price}}" selected="true">{{Description}}</option>', '{{else}}', '<option value="{{Price}}">{{Description}}</option>', '{{/if}}', '{{/each}}', '</select>', '</div>', '{{/if}}', '{{/if}}', '</div>'].join('')),
    pass: Handlebars.compile(['<div class="pass-field">', '{{#if Card.CannotBeUsed}}', '{{else}}', '<div class="mt-current-passes">', '&nbsp;', '{{#each Card.CurrentPasses}}', '<span>{{Description}}', '{{#if IsNearingExpiration}}', '<img src="/content/site/img/icon/silk/error.png" alt="This pass is nearing its expiration date." />', '{{/if}}', '</span><br />', '{{/each}}', '</div>', '{{/if}}', '{{#if Card.CannotAddValueOrPass}}', '{{else}}', '{{#if Card.BuyablePasses.length}}', '<div class="mt-add-pass">', '<label for="I[{{SerialNumberOnly}}].P" class="sr-only">Add pass</label>', '<select id="I[{{SerialNumberOnly}}].P" name="I[{{SerialNumberOnly}}].P">', '<option value="">Add pass</option>', '{{#each Card.BuyablePasses}}', '{{#if Selected}}>', '<option value="{{SalesItemKey}}" selected="true">{{Description}}</option>', '{{else}}', '<option value="{{SalesItemKey}}">{{Description}}</option>', '{{/if}}', '{{/each}}', '</select>', '</div>', '{{/if}}', '{{/if}}', '<div class="mt-messages">', '{{#each Card.AlertMessages}}', '<span class="mt-alert">{{.}}</span>', '{{/each}}', '</div>', '</div>'].join('')),
    action: Handlebars.compile(['<div class="action-field d-flex flex-column">', '<a href="javascript:void(0)" data-serial="{{SerialNumberOnly}}" onclick="mfcl.action(this)" data-command="view-history" id="view-history-{{SerialNumberOnly}}">Transaction History</a>', '{{#if Card.IsRegistered}}', '<a href="javascript:void(0)" data-serial="{{SerialNumberOnly}}" onclick="mfcl.action(this)" data-command="edit-registration" id="edit-registration-{{SerialNumberOnly}}">Edit Registration</a>', '{{else}}', '<a href="javascript:void(0)" data-serial="{{SerialNumberOnly}}" onclick="mfcl.action(this)" data-command="register-card" id="register-card-{{SerialNumberOnly}}">Register Card</a>', '{{/if}}', '{{#if Card.IsEnrolledAutoRefill}}', '<a href="javascript:void(0)" data-serial="{{SerialNumberOnly}}" onclick="mfcl.action(this)" data-command="edit-enrollment" id="edit-enrollment-{{SerialNumberOnly}}">Edit Auto Refill</a>', '{{else}}', '<a href="javascript:void(0)" data-serial="{{SerialNumberOnly}}" onclick="mfcl.action(this)" data-command="enroll-card" id="enroll-card-{{SerialNumberOnly}}">Enroll in Auto Refill</a>', '{{/if}}', '{{#if Card.IsHotlisted}}', '{{else}}', '<a href="javascript:void(0)" data-serial="{{SerialNumberOnly}}" onclick="mfcl.action(this)" data-command="deactivate-card" id="deactivate-card-{{SerialNumberOnly}}">Deactivate</a>', '{{/if}}', '</div>'].join(''))
  },
  table: null,
  // intialize My Fare Card List
  init: function init() {
    Handlebars.registerHelper('currency', function (number) {
      return '$' + number.toFixed(2);
    });
    this.table = $('#myFareCardList').DataTable({
      ajax: {
        url: '/api/MyFareCardListDataTable',
        type: 'GET',
        contentType: 'application/json'
      },
      autoWidth: false,
      columns: [{
        data: 'SerialNumber',
        orderable: true,
        width: '165px'
      }, {
        data: 'NickName',
        orderable: true,
        width: '105px'
      }, {
        data: null,
        defaultContent: '...',
        orderable: false,
        width: '107px'
      }, {
        data: null,
        defaultContent: '...',
        orderable: false,
        width: '440px'
      }, {
        data: null,
        defaultContent: 'Loading...',
        orderable: false,
        width: '150px'
      }],
      // call only once per row
      createdRow: function createdRow(row, data, index) {
        //console.log('createdRow');
        $.ajax({
          url: '/api/myfarecarddetail/' + data.SerialNumber,
          method: 'GET',
          contentType: 'application/json',
          context: {
            'Row': row,
            Record: data,
            RowIndex: index
          }
        }).done(function (value) {
          var jqrow = $(this.Row); //row wrapped as jquery object

          if (value.Success) {
            var card = value.Items[0];
            this.Record.Detail = card;
            var dataForTemplate = {
              Record: this.Record,
              Card: card,
              RowIndex: this.RowIndex,
              SerialNumberOnly: this.Record.SerialNumber.replace(/-/g, '')
            };
            jqrow.attr('id', dataForTemplate.SerialNumberOnly);

            if (card.CannotBeUsed) {
              jqrow.addClass('mfcl-row-alert-warning');
            } // using mustache compiled templates to generate custom markup foreach grid cell


            $(jqrow.children('td')[0]).html(mfcl.compiledTemplates.serial(dataForTemplate));
            $(jqrow.children('td')[1]).html(mfcl.compiledTemplates.nickname(dataForTemplate));
            $(jqrow.children('td')[2]).html(mfcl.compiledTemplates.value(dataForTemplate));
            $(jqrow.children('td')[3]).html(mfcl.compiledTemplates.pass(dataForTemplate));
            $(jqrow.children('td')[4]).html(mfcl.compiledTemplates.action(dataForTemplate));
          } else {
            jqrow.addClass('mfcl-row-alert-danger');
            $(jqrow.children('td')[2]).html('');
            $(jqrow.children('td')[3]).html('An unexpected error has occurred.');
            $(jqrow.children('td')[4]).html('');
          }
        }).fail(function (xhr) {//console.log('error', xhr);
        });
      },
      deferRender: true,
      ordering: true,
      paging: true,
      scroller: true,
      //scroller extension
      //scrollCollapse: true,
      scrollY: '532',
      searching: false,
      serverSide: false
    });
    $('#mfcl-form').bind('submit', this.onFormSubmit);
  },
  action: function action(el) {
    var command = $(el).attr('data-command');
    var serial = $(el).attr('data-serial');
    var row = $(el).parents('tr')[0]; //console.log(command, serial);

    switch (command) {
      case 'remove-card':
        this.removeCard(row, serial);
        break;

      case 'edit-nickname':
        this.editNickname(row, serial);
        break;

      case 'save-nickname':
        this.saveNickname(row, serial);
        break;

      case 'cancel-nickname':
        this.cancelNickname(row, serial);
        break;

      case 'register-card':
        this.registerCard(row, serial);
        break;

      case 'edit-registration':
        this.editRegistration(row, serial);
        break;

      case 'enroll-card':
        this.enrollCard(row, serial);
        break;

      case 'edit-enrollment':
        this.editEnrollment(row, serial);
        break;

      case 'view-history':
        this.viewHistory(row, serial);
        break;
    }
  },
  removeCard: function removeCard(row, serial) {
    $.ajax({
      url: '/api/MyFareCardListDataTable/' + serial,
      method: 'DELETE',
      contentType: 'application/json',
      context: {
        'Row': row,
        Serial: serial
      }
    }).done(function (value) {
      //console.log('success', this.RowIndex);
      $(this.Row).remove();
    }).fail(function (xhr) {//console.log('error', xhr);
    });
  },
  editNickname: function editNickname(row, serial) {
    $(row).find('.nickname-field').toggleClass('edit-mode');
  },
  saveNickname: function saveNickname(row, serial) {
    var newNickname = $(row).find('input#nickname-' + serial).val();
    $.ajax({
      url: '/api/MyFareCardListDataTable/' + serial,
      method: 'PUT',
      contentType: 'application/json',
      context: {
        'Row': row,
        Serial: serial,
        Nickname: newNickname
      },
      data: JSON.stringify({
        Nickname: newNickname
      })
    }).done(function (value) {
      // update UI to reflect SUCCESS
      $(this.Row).find('.nickname-field span').text(this.Nickname);
      $(this.Row).find('.nickname-field').toggleClass('edit-mode');
    }).fail(function (xhr) {//console.log('error', xhr);
    });
  },
  cancelNickname: function cancelNickname(row, serial) {
    $(row).find('.nickname-field').toggleClass('edit-mode');
  },
  addCard: function addCard(serial, nickname) {
    //console.log('addCard', arguments);
    this.table.ajax.reload();
  },
  navigateAway: function navigateAway(serial, reason) {
    $('#NavigateAwaySerial').val(serial);
    $('#NavigateAwayReason').val(reason);
    $('#mfcl-form').submit();
  },
  viewHistory: function viewHistory(row, serial) {
    this.navigateAway(serial, 'ViewTransactionHistory');
  },
  registerCard: function registerCard(row, serial) {
    this.navigateAway(serial, 'RegisterFareCard');
  },
  editRegistration: function editRegistration(row, serial) {
    this.navigateAway(serial, 'RegisterFareCard');
  },
  enrollCard: function enrollCard(row, serial) {
    // send serial# and cause post back event, see server side postback for rest
    this.navigateAway(serial, 'Enroll');
  },
  editEnrollment: function editEnrollment(row, serial) {
    // send serial# and cause post back event, see server side postback for rest
    this.navigateAway(serial, 'EditEnrollment');
  },
  deactivateCard: function deactivateCard(row, serial) {
    this.navigateAway(serial, 'DeactivateFareCard');
  },
  onFormSubmit: function onFormSubmit(e) {
    // we have to intercpet form submit because DataTables only keeps the current page of data (about 40 rows) in the DOM
    // logic is based on https://www.gyrocode.com/articles/jquery-datatables-how-to-submit-all-pages-form-data/
    var form = this; // Encode a set of form elements from all pages as an array of names and values

    var fields = mfcl.table.$('input,select').serializeArray(); // Iterate over all form elements

    $.each(fields, function (index, field) {
      // If element doesn't exist in DOM
      if (!$.contains(document, form[field.name])) {
        // Create a hidden element
        $(form).append($('<input>').attr('type', 'hidden').attr('name', field.name).val(field.value));
      }
    });
  },
  onNicknameKeyPress: function onNicknameKeyPress(ev, el) {
    // - Improved the MFCL UX by allowing customer to edit a nickname and save thier edit by clicking the enter key. Previously the entire form was being submitted.
    if (ev.keyCode === 13) {
      ev.preventDefault();
      var serial = $(el).attr('data-serial');
      var row = $(el).parents('tr')[0];
      this.saveNickname(row, serial);
    }
  }
};
window.mfcl = mfcl;