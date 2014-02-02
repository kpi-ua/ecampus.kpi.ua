<%@ Page Title="" Language="C#" MasterPageFile="~/SitePlusNav.Master" AutoEventWireup="true" CodeBehind="TimeTableMain.aspx.cs" Inherits="Site.TimeTable.TimeTableMain" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <link href='http://fonts.googleapis.com/css?family=Alegreya+Sans' rel='stylesheet' type='text/css'/>
    <%--<script type="text/javascript" src="../Scripts/jquery.min.js"></script>--%>
    <script type="text/javascript">
        var sessionId = '<%= Session["UserData"] %>';
    </script>
	<script type="text/javascript" src="../Scripts/timetable.js"></script>
    <link rel="stylesheet" type="text/css" href="../Content/timetable.css"/>
    
    <table id="timetable">
		<thead>
		<td colspan="2">
            <div id="header_week">
            <span class="header_weeknumb">I </span>
            <span class="header_weeknumb">II </span>
            <span class="header_weeknumb">I </span>
			<span class="header_weeknumb">II</span>
			</div>
		</td>
		</thead>	

		<tbody id="tableinput">
            </tbody>
	</table>
    <img id='loading' alt="loading..." src="../Images/loading.gif"/>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="right_column" runat="server">
</asp:Content>