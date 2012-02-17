using System;
using System.Globalization;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Markup;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace GSinPV
{
    public class TextToSolidColorConverter : IValueConverter
    {

        public int colorCounter = 0;

        public object Convert(object value,
                            Type targetType,
                            object parameter,
                            CultureInfo culture)
        {
            string[] colorsToUse = new string[] {
                "pink", "lightGoldenrodYellow", "lightBlue", "lightSeaGreen",
                "peachPuff", "lightCyan", "lightSlateGray" };

            string textToConvert = value.ToString();
            string colorToUse = "lightBlue";

            switch (textToConvert)
            {
                case "problem":
                    colorToUse = colorsToUse[0];
                    break;
                case "idea":
                    colorToUse = colorsToUse[1];
                    break;
                case "question":
                    colorToUse = colorsToUse[2];
                    break;
                case "praise":
                    colorToUse = colorsToUse[3];
                    break;
                case "update":
                    colorToUse = colorsToUse[4];
                    break;
                default:
                    colorToUse = colorsToUse[colorCounter];
                    colorCounter = (colorCounter + 1) % colorsToUse.Length;
                    break;
            }

            var xaml = "<SolidColorBrush " +
                        "xmlns='http://schemas.microsoft.com/client/2007' " +
                        "Color=\"" + colorToUse + "\"/>";
            return XamlReader.Load(xaml);
        }

        public object ConvertBack(object value,
                            Type targetType,
                            object parameter,
                            CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
