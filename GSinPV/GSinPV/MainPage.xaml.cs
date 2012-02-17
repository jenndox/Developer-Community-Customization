using System;
using System.Collections.Generic;
using System.Windows.Controls;
using System.Net;
using System.Windows.Controls.Pivot;
using System.ServiceModel;
using System.Runtime.Serialization.Json;
using System.Text;
using System.IO;
using System.Windows.Browser;
using System.Windows;
using System.Collections.ObjectModel;
using System.Windows.Media.Imaging;
using System.Windows.Data;
using System.Windows.Navigation;
using SilverlightMessageBoxLibrary;

namespace GSinPV
{
    [ScriptableType]
    public partial class MainPage : UserControl
    {
        // Define the full companies response format
        public class CompaniesData
        {
            public int total { get; set; }
            public Company[] data { get; set; }
        }
        // Define the Company data type
        public class Company
        {
            public string logo { get; set; }
            public int approximate_topic_count { get; set; }
            public string locale { get; set; }
            public string url { get; set; }
            public string name { get; set; }
            public string people { get; set; }
            public string topics { get; set; }
            public int id { get; set; }
            public BitmapImage image { get; set; }
            public string domain { get; set; } 
        }
        // Define the full response format
        public class TopicData
        {
            public int total { get; set; }
            public Topic[] data { get; set; }
        }
        // Define the Topic data type
        public class Topic
        {
            public string status { get; set; }
            public bool employee { get; set; }
            public Person author { get; set; }
            public int active_replies { get; set; }
            public string style { get; set; }
            public int follower_count { get; set; }
            public bool is_closed { get; set; }
            public string at_sfn { get; set; }
            public bool has_promoted_replies { get; set; }
            public DateTime last_active_at { get; set; }
            public string subject { get; set; }
            public Emote emotitag { get; set; }
            public string content { get; set; }
            public string user_defined_code { get; set; }
            public DateTime crated_at { get; set; }
            public int me_too_count { get; set; }
            public int id { get; set; }
            public int reply_count { get; set; }
            public string styleImage { get; set; }
        }
        // Define the emote data type
        public class Emote
        {
            public string face { get; set; }
            public string feeling { get; set; }
            public string intensity { get; set; }
        }
        // Define the full people response format
        public class PeopleData
        {
            public int total { get; set; }
            public Person[] data { get; set; }
        }
        // Define the person data type
        public class Person
        {
            public bool employee { get; set; }
            public string avatar_url_large { get; set; }
            public string title { get; set; }
            public string at_sfn { get; set; }
            public string canonical_name { get; set; }
            public bool champion { get; set; }
            public string name { get; set; }
            public int id { get; set; }
            public string tagline { get; set; }
            public string topics { get; set; }
        }

        public string[] StyleImages = new string[]
        {
            "https://getsatisfaction.com/images/problem_small.png",
            "https://getsatisfaction.com/images/question_small.png",
            "https://getsatisfaction.com/images/idea_small.png",
            "https://getsatisfaction.com/images/praise_small.png",
            "https://getsatisfaction.com/images/update_small.png",
        };

        public MainPage()
        {
            InitializeComponent();
            HtmlPage.RegisterScriptableObject("Page", this);

            System.Windows.Interop.SilverlightHost host = Application.Current.Host;
            System.Windows.Interop.Settings settings = host.Settings;

            bool enableAccess = settings.EnableHTMLAccess;
            enableAccess = true;

            string query = "get%20satisfaction";

            // Display the URL parameters.
            foreach (String key in HtmlPage.Document.QueryString.Keys)
            {
                if ((key == "query") || (key == "q"))
                {
                    query = HtmlPage.Document.QueryString[key];
                }
            }            
            
            //string query = HtmlPage.Window.Prompt("What community are you looking for?");
            getCommunities(query);
            gspivotviewer.ItemsSource = new ObservableCollection<Company>();
        }

        public void getCommunities(string queryString)
        {
            Uri apiToCall = new Uri("https://api.getsatisfaction.com/companies.json?query=" + queryString + "&limit=50&page=0&callback=handlerCompanies");

            HtmlPage.Window.Invoke("injectScript", apiToCall, "Companies");
        }

        [ScriptableMember]
        public void PassCompanyData(string data)
        {
            CompaniesData companiesData = new CompaniesData();
            MemoryStream ms = new MemoryStream(Encoding.Unicode.GetBytes(data));
            System.Runtime.Serialization.Json.DataContractJsonSerializer serializer = new System.Runtime.Serialization.Json.DataContractJsonSerializer(companiesData.GetType());
            companiesData = serializer.ReadObject(ms) as CompaniesData;
            ms.Close();

            var coll = gspivotviewer.ItemsSource
                   as ObservableCollection<Company>;
            foreach (Company company in companiesData.data)
            {
                coll.Add(company);
            }
        }

        private void basicAdorner_CommandsRequested(object sender,
            PivotViewerCommandsRequestedEventArgs e)
        {
            var company = e.Item as Company;
            e.Commands.Add(new TopicCommand()
            {
                TopicUrl = company.topics
            });
            e.Commands.Add(new PeopleCommand()
            {
                PeopleUrl = company.people
            });
            e.Commands.Add(new CommunityURLCommand()
            {
                LinkUrl = company.domain
            });
        }

        private void topicAdorner_CommandsRequested(object sender,
            PivotViewerCommandsRequestedEventArgs e)
        {
            var topic = e.Item as Topic;
            e.Commands.Add(new TopicURLCommand()
            {
                LinkUrl = topic.at_sfn
            });
        }

        private void peopleAdorner_CommandsRequested(object sender,
            PivotViewerCommandsRequestedEventArgs e)
        {
            var person = e.Item as Person;
            e.Commands.Add(new PeopleURLCommand()
            {
                LinkUrl = person.at_sfn
            });
        }

        [ScriptableMember]
        public void PassTopicData(string data)
        {
            TopicData topicData = new TopicData();
            MemoryStream ms = new MemoryStream(Encoding.Unicode.GetBytes(data));
            System.Runtime.Serialization.Json.DataContractJsonSerializer serializer = new System.Runtime.Serialization.Json.DataContractJsonSerializer(topicData.GetType());
            topicData = serializer.ReadObject(ms) as TopicData;
            ms.Close();

            gspivotviewer.ItemAdornerStyle = this.Resources["topicAdorner"] as Style;

            gspivotviewer.PivotProperties.Clear();
            gspivotviewer.PivotProperties = new List<PivotViewerProperty>()
            {
                new PivotViewerNumericProperty()
                    {
                        Binding = new Binding("me_too_count"),
                        Id = "Me Too Count",
                        Options = PivotViewerPropertyOptions.CanFilter
                        | PivotViewerPropertyOptions.CanSearchText
                    },
                new PivotViewerStringProperty()
                    {
                        Binding = new Binding("style"),
                        Id = "Style",
                        Options = PivotViewerPropertyOptions.CanFilter
                        | PivotViewerPropertyOptions.CanSearchText
                    },
                new PivotViewerStringProperty()
                    {
                        Binding = new Binding("at_sfn"),
                        Id = "URL",
                        Options = PivotViewerPropertyOptions.CanFilter
                        | PivotViewerPropertyOptions.CanSearchText
                    },
                new PivotViewerStringProperty()
                    {
                        Binding = new Binding("content"),
                        Id = "Content",
                        Options = PivotViewerPropertyOptions.CanFilter
                        | PivotViewerPropertyOptions.CanSearchText
                    },
                new PivotViewerNumericProperty()
                    {
                        Binding = new Binding("reply_count"),
                        Id = "Reply Count",
                        Options = PivotViewerPropertyOptions.CanFilter
                        | PivotViewerPropertyOptions.CanSearchText
                    },
                new PivotViewerStringProperty()
                    {
                        Binding = new Binding("status"),
                        Id = "Status",
                        Options = PivotViewerPropertyOptions.CanFilter
                        | PivotViewerPropertyOptions.CanSearchText
                    },
                new PivotViewerStringProperty()
                    {
                        Binding = new Binding("subject"),
                        Id = "Subject",
                        Options = PivotViewerPropertyOptions.CanFilter
                        | PivotViewerPropertyOptions.CanSearchText
                    },
                new PivotViewerStringProperty()
                    {
                        Binding = new Binding("emotitag.face"),
                        Id = "Emotion",
                        Options = PivotViewerPropertyOptions.CanFilter
                        | PivotViewerPropertyOptions.CanSearchText
                    },
                new PivotViewerStringProperty()
                    {
                        Binding = new Binding("emotitag.feeling"),
                        Id = "Feeling",
                        Options = PivotViewerPropertyOptions.CanFilter
                        | PivotViewerPropertyOptions.CanSearchText
                    }
            };

            gspivotviewer.ItemTemplates = new PivotViewerItemTemplateCollection();
            gspivotviewer.ItemTemplates.Add((PivotViewerItemTemplate)Resources["topicsTemplate"]);

            gspivotviewer.ItemsSource = new ObservableCollection<Topic>();
            var coll = gspivotviewer.ItemsSource
                   as ObservableCollection<Topic>;
            coll.Clear();
            foreach (Topic topic in topicData.data)
            {
                switch (topic.style)
                {
                    case "problem":
                        topic.styleImage = StyleImages[0];
                        break;
                    case "idea":
                        topic.styleImage = StyleImages[1];
                        break;
                    case "question":
                        topic.styleImage = StyleImages[2];
                        break;
                    case "praise":
                        topic.styleImage = StyleImages[3];
                        break;
                    case "update":
                        topic.styleImage = StyleImages[4];
                        break;
                }
                coll.Add(topic);
            }
            if (topicData.total > 50)
            {
                for (int counter = 1; counter < 4; counter++)
                {
                    if (topicData.total > counter * 50)
                    {
                        string apiToCall = "/topics.json?sort=recently_active&limit=50&page=" + counter + "&callback=handlerMoreTopics";
                        HtmlPage.Window.Invoke("getMoreData", apiToCall, "People");
                    }
                }
            }
        }

        [ScriptableMember]
        public void AddMoreTopics(string data)
        {
            TopicData topicData = new TopicData();
            MemoryStream ms = new MemoryStream(Encoding.Unicode.GetBytes(data));
            System.Runtime.Serialization.Json.DataContractJsonSerializer serializer = new System.Runtime.Serialization.Json.DataContractJsonSerializer(topicData.GetType());
            topicData = serializer.ReadObject(ms) as TopicData;
            ms.Close();

            var coll = gspivotviewer.ItemsSource
                as ObservableCollection<Topic>;
            foreach (Topic topic in topicData.data)
            {
                switch (topic.style)
                {
                    case "problem":
                        topic.styleImage = StyleImages[0];
                        break;
                    case "idea":
                        topic.styleImage = StyleImages[1];
                        break;
                    case "question":
                        topic.styleImage = StyleImages[2];
                        break;
                    case "praise":
                        topic.styleImage = StyleImages[3];
                        break;
                    case "update":
                        topic.styleImage = StyleImages[4];
                        break;
                }
                coll.Add(topic);
            }
        }

        [ScriptableMember]
        public void PassPeopleData(string data)
        {
            PeopleData peopleData = new PeopleData();
            MemoryStream ms = new MemoryStream(Encoding.Unicode.GetBytes(data));
            System.Runtime.Serialization.Json.DataContractJsonSerializer serializer = new System.Runtime.Serialization.Json.DataContractJsonSerializer(peopleData.GetType());
            peopleData = serializer.ReadObject(ms) as PeopleData;
            ms.Close();

            gspivotviewer.ItemAdornerStyle = this.Resources["peopleAdorner"] as Style;

            gspivotviewer.PivotProperties.Clear();
            gspivotviewer.PivotProperties = new List<PivotViewerProperty>()
            {
                new PivotViewerStringProperty()
                    {
                        Binding = new Binding("name"),
                        Id = "Name",
                        Options = PivotViewerPropertyOptions.CanFilter
                        | PivotViewerPropertyOptions.CanSearchText
                    },
                new PivotViewerStringProperty()
                    {
                        Binding = new Binding("employee"),
                        Id = "Employee",
                        Options = PivotViewerPropertyOptions.CanFilter
                        | PivotViewerPropertyOptions.CanSearchText
                    },
                new PivotViewerStringProperty()
                    {
                        Binding = new Binding("champion"),
                        Id = "Champion",
                        Options = PivotViewerPropertyOptions.CanFilter
                        | PivotViewerPropertyOptions.CanSearchText
                    },
                new PivotViewerStringProperty()
                    {
                        Binding = new Binding("tagline"),
                        Id = "Tagline",
                        Options = PivotViewerPropertyOptions.CanFilter
                        | PivotViewerPropertyOptions.CanSearchText
                    },
                new PivotViewerStringProperty()
                    {
                        Binding = new Binding("at_sfn"),
                        Id = "URL",
                        Options = PivotViewerPropertyOptions.CanFilter
                        | PivotViewerPropertyOptions.CanSearchText
                    }
            };

            gspivotviewer.ItemTemplates = new PivotViewerItemTemplateCollection();
            gspivotviewer.ItemTemplates.Add((PivotViewerItemTemplate)Resources["peopleTemplate"]);
            
            gspivotviewer.ItemsSource = new ObservableCollection<Person>();
            var coll = gspivotviewer.ItemsSource
                   as ObservableCollection<Person>;
            coll.Clear();
            foreach (Person person in peopleData.data)
            {
                coll.Add(person);
            }

            if (peopleData.total > 50)
            {
                for (int counter = 1; counter < 4; counter++)
                {
                    if (peopleData.total > counter * 50)
                    {
                        string apiToCall = "/people.json?filter=visitor&limit=50&page=" + counter + "&callback=handlerMorePeople";
                        HtmlPage.Window.Invoke("getMoreData", apiToCall, "People");
                    }
                }
            }
        }

        [ScriptableMember]
        public void AddMorePeople(string data)
        {
            PeopleData peopleData = new PeopleData();
            MemoryStream ms = new MemoryStream(Encoding.Unicode.GetBytes(data));
            System.Runtime.Serialization.Json.DataContractJsonSerializer serializer = new System.Runtime.Serialization.Json.DataContractJsonSerializer(peopleData.GetType());
            peopleData = serializer.ReadObject(ms) as PeopleData;
            ms.Close();

            gspivotviewer.ItemsSource = new ObservableCollection<Person>();
            var coll = gspivotviewer.ItemsSource
                   as ObservableCollection<Person>;
            foreach (Person person in peopleData.data)
            {
                coll.Add(person);
            }
        }
    }
}
