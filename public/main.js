$(function() {
  $("#table_striped thead").on("click", "th", function() {
    if ($(this).data('name') === undefined) {
      return;
    } else {
      //alert($(this).data('name'));
      var sortInfo = {
        sortKey: $(this).data('name'),
        sortOrder: $(this).data('sort')
      };
      $.get("/scoreSort", sortInfo, function(result) {
        //console.log(result);
        $("#table_striped tbody").empty();
        result.forEach(function(val) {
          $("tbody").append("<tr>" +
            "<td>" + val.studentId + "</td>" +
            "<td>" + val.name + "</td>" +
            "<td>" + val.Chinese + "</td>" +
            "<td>" + val.Math + "</td>" +
            "<td>" + val.English + "</td>" +
            "<td>" + "<input type='button' class='delete' value='delete'>" +
            "</td>" +
            "</tr>");
        });
      });
      var order = $(this).data('order') === '1' ? '-1' : '1';
      $(this).data('order', order);
    }
  });

  $("#table_striped tbody").on("click", ".delete", function() {
    var delScoreItem = $(this).parent().parent().children();
    var delStudentId = delScoreItem.eq(0).text().trim();
    var delName = delScoreItem.eq(1).text().trim();
    alert("Are you sure to delete the student: " + delName);
    $(this).parent().parent().remove();
    $.ajax({
      url: '/delScore',
      data: {
        delStudentId: delStudentId
      },
      type: 'DELETE',
      success: function(result) {
        console.log(result);
        switch (result.status) {
          case 200:
            var delChinese = delScoreItem.eq(2).text().trim();
            var delMath = delScoreItem.eq(3).text().trim();
            var delEnglish = delScoreItem.eq(4).text().trim();
            alert("Delete the success：name:" + delName + "Chinese:" + delChinese + "Math:" + delMath + "English:" + delEnglish);
            $(this).parent().parent().remove();
            break;
          case 404:
            alert("You delete the data does not exist");
            break;
          default:
            alert(result.message);
        }
      }
    });
  });

  $("#table_striped ").on("click", ".insert", function() {
    var InsertStudent = {};
    var that = this;
    InsertStudent.InsertName = $("#InsertName").val().trim();
    InsertStudent.InsertChinese = $("#InsertChinese").val().trim();
    InsertStudent.InsertMath = $("#InsertMath").val().trim();
    InsertStudent.InsertEnglish = $("#InsertEnglish").val().trim();
    alert("Are you sure to insert Student: " + InsertStudent.InsertName);
    $.ajax({
      url: '/InsertScore',
      data: InsertStudent,
      type: 'POST',
      success: function(result) {
        switch (result.status) {
          case 200:
            var StudentId = result.data;
            $(that).closest("table").find("tbody").append("<tr><td>" +
              StudentId + "</td><td>" +
              InsertStudent.InsertName + "</td><td>" +
              InsertStudent.InsertChinese + "</td><td>" +
              InsertStudent.InsertMath + "</td><td>" +
              InsertStudent.InsertEnglish + "</td><td><input type='button' class='delete' value='delete'></td></tr>"
            );
             $("#InsertName").val('');
             $("#InsertChinese").val('');
             $("#InsertMath").val('');
             $("#InsertEnglish").val('');

            alert("Insert success");
            break;
          case 404:
            alert("Inser failed");
            break;
          default:
            alert(result.message);
        }
      }

    });
  });
});
