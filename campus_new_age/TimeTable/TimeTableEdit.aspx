<%@ Page Title="" Language="C#" MasterPageFile="~/SitePlusNav.Master" AutoEventWireup="true" CodeBehind="TimeTableEdit.aspx.cs" Inherits="campus_new_age.TimeTable.TimeTableEdit" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <asp:UpdatePanel ID="worker" runat="server" OnLoad="worker_Load">
        <ContentTemplate>
            <label>Faculty:</label>
            <asp:DropDownList ID="facultylist" runat="server" AutoPostBack="True" OnSelectedIndexChanged="facultylist_SelectedIndexChanged">
                <asp:ListItem Text="" Value="" Selected="True" ></asp:ListItem>
            </asp:DropDownList><br/>
            <label>SubDivision:</label>
            <asp:DropDownList ID="subdivisionlist" runat="server" AutoPostBack="True" OnSelectedIndexChanged="subdivisionlist_SelectedIndexChanged">
                <asp:ListItem Text="" Value="" Selected="True"></asp:ListItem>
            </asp:DropDownList><br/>
          <asp:Label runat="server" Text="Вкажіть тип працівника:"></asp:Label>
            <asp:RadioButtonList ID="workerradiolist" runat="server" OnSelectedIndexChanged="workerradiolist_SelectedIndexChanged" AutoPostBack="True">
                <asp:ListItem Text="Full" Selected="true" Value="full"></asp:ListItem>
                <asp:ListItem Text="not full" Value="part"></asp:ListItem>
            </asp:RadioButtonList>
            <asp:DropDownList ID="employeelist" runat="server" OnSelectedIndexChanged="employeelist_SelectedIndexChanged" AutoPostBack="True"></asp:DropDownList><br/>

            <label>Course:</label>
            <asp:DropDownList ID="courselist" runat="server" AutoPostBack="True" OnSelectedIndexChanged="courselist_SelectedIndexChanged">
                <asp:ListItem Text="" Value="" Selected="True" ></asp:ListItem>
                <asp:ListItem Text="1" Value="1" ></asp:ListItem>
                <asp:ListItem Text="2" Value="2" ></asp:ListItem>
                <asp:ListItem Text="3" Value="3" ></asp:ListItem>
                <asp:ListItem Text="4" Value="4" ></asp:ListItem>
                <asp:ListItem Text="5" Value="5" ></asp:ListItem>
                <asp:ListItem Text="6" Value="6" ></asp:ListItem>
            </asp:DropDownList><br/>

            <label>Speciality:</label>
            <asp:DropDownList ID="specialitylist" runat="server" AutoPostBack="True" OnSelectedIndexChanged="specialitylist_SelectedIndexChanged">
                <asp:ListItem Text="" Value="" Selected="True" ></asp:ListItem>
            </asp:DropDownList><br/>

            <label>StudyForm:</label>
            <asp:DropDownList ID="studyformlist" runat="server" AutoPostBack="True" OnSelectedIndexChanged="studyformlist_SelectedIndexChanged">
                <asp:ListItem Text="" Value="" Selected="True" ></asp:ListItem>
            </asp:DropDownList><br/>
            
            <label>Subject:</label>
            <asp:DropDownList ID="subjectlist" runat="server" AutoPostBack="True">
                <asp:ListItem Text="" Value="" Selected="True" ></asp:ListItem>
            </asp:DropDownList><br/>

            <label>StudyGroup:</label>
            <asp:DropDownList ID="studygrouplist" runat="server">
                <asp:ListItem Text="" Value="" Selected="True" ></asp:ListItem>
            </asp:DropDownList><br/>

            <label>Building:</label>
            <asp:DropDownList ID="buildinglist" runat="server">
                <asp:ListItem Text="" Value="" Selected="True" ></asp:ListItem>
            </asp:DropDownList><br/>

            <label>Lesson:</label>
            <asp:DropDownList ID="lessonlist" runat="server">
                <asp:ListItem Text="" Value="" ></asp:ListItem>
                <asp:ListItem Text="1" Value="1" ></asp:ListItem>
                <asp:ListItem Text="2" Value="2" ></asp:ListItem>
                <asp:ListItem Text="3" Value="3" ></asp:ListItem>
                <asp:ListItem Text="4" Value="4" ></asp:ListItem>
                <asp:ListItem Text="5" Value="5" ></asp:ListItem>
                <asp:ListItem Text="6" Value="6" ></asp:ListItem>
                <asp:ListItem Text="7" Value="7" ></asp:ListItem>
            </asp:DropDownList><br/>

            <label>Day:</label>
            <asp:DropDownList ID="weekdaylist" runat="server">
                <asp:ListItem Text="" Value="" Selected="True" ></asp:ListItem>
                <asp:ListItem Text="Пн" Value="1"  ></asp:ListItem>
                <asp:ListItem Text="Вт" Value="2"  ></asp:ListItem>
                <asp:ListItem Text="Ср" Value="3"  ></asp:ListItem>
                <asp:ListItem Text="Чт" Value="4"  ></asp:ListItem>
                <asp:ListItem Text="Пт" Value="5"  ></asp:ListItem>
                <asp:ListItem Text="Сб" Value="6"  ></asp:ListItem>
                <asp:ListItem Text="Вс" Value="7"  ></asp:ListItem>
            </asp:DropDownList>
            
            <label>WeekNum:</label>
            <asp:DropDownList ID="weeknumlist" runat="server">
                <asp:ListItem Text="" Value="" Selected="True"></asp:ListItem>
                <asp:ListItem Text="All" Value="0" ></asp:ListItem>
                <asp:ListItem Text="1st" Value="1" ></asp:ListItem>
                <asp:ListItem Text="2nd" Value="2" ></asp:ListItem>
            </asp:DropDownList>
        </ContentTemplate>
    </asp:UpdatePanel>
    <asp:Button ID="save" Text="Save"  runat="server" OnClick="save_Click"/><asp:Label ID="answer" runat="server"></asp:Label>
    
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="right_column" runat="server">
</asp:Content>
