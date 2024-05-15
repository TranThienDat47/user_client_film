export default (content) => {
   if (content.includes('_split_character_'))
      return (
         <>
            <strong>{content.split('_split_character_')[0]}</strong>
            {content.split('_split_character_')[1]}
         </>
      );

   return content;
};
